import { Backend, ChangedTask, type ItemChangeType } from "@/shared/service/domain/interfaces/backend";
import { addDoc, collection, collectionGroup, doc, DocumentChangeType, Firestore, getDocs, onSnapshot, orderBy, where, query, DocumentSnapshot, DocumentData, Unsubscribe } from "firebase/firestore";
import { Observable } from "rxjs";
import { convert, convertLog, FSLog, FSTask, LayerStatusTypeValues } from "./entities/tasks";
import { Log, Task } from "@/shared/service/domain/entities/task";
import { resolve } from "path";

const CollectionType = {
    users : "users"
    , rooms : "rooms"
    , tasks : "tasks"
    , templates : "templates"
    , logs : "logs"
    , deeds : "deeds"
    , invitations : "invitations"
    , notifications : "notifications"
    , doings : "doings"
    , messages : "messages"
} as const;

type CollectionType = typeof CollectionType[keyof typeof CollectionType];

export class FirestoreBackend implements Backend {
    #db: Firestore;
    unsubscribers: Array<() => void>; // TODO: サインアウト時に unscribe する

    constructor(db: Firestore) {
        this.#db = db;
        this.unsubscribers = new Array<() => void>();
    }

    /**
     * ユーザがInvolvedにいて、Closeされていない、Project以外のタスクを返す
     * @param userId
     * @returns
     */
    observeTasks(userId: string): Observable<ChangedTask[]> {
        return new Observable(subscriber => {
            const unsubscribe = onSnapshot(
                query(
                    collection(this.#db, CollectionType.tasks)
                    // Closed含まない: TA1 <= x < TZ1
                    , where("typeStatus", ">=", `${ LayerStatusTypeValues.layers.task }${ LayerStatusTypeValues.statuses.preinitiation }${ LayerStatusTypeValues.types.task.todo }`)
                    , where("typeStatus", "<",  `${ LayerStatusTypeValues.layers.task }${ LayerStatusTypeValues.statuses.closed }${ LayerStatusTypeValues.types.task.todo }`)
                    , where("involved", "array-contains", userId)
                )
                , (snapshot) => {
                    const changedItems = snapshot.docChanges()
                        .map(change => {
                            const taskId = change.doc.id;
                            const taskData = change.doc.data() as FSTask;
                            // ここで Work を取ってくると見ないタスクのものまで取ってきてしまうのでやらないこと
                            return ChangedTask[change.type]({ id: taskId, item: convert(taskId, taskData) });
                        });
                    subscriber.next(changedItems);
                });
            
            this.unsubscribers.push(unsubscribe);
        });
    }

    /**
     * ユーザのプロジェクトの一覧を返します。childrenは取得しません。
     * @param userId 
     */
    observeUsersProjects(userId: string): Observable<ChangedTask[]> {
        return new Observable(subscriber => {
            const unsubscribe = onSnapshot(
                query(
                    collection(this.#db, CollectionType.tasks)
                    , where("typeStatus", ">=", `${ LayerStatusTypeValues.layers.project }${ LayerStatusTypeValues.statuses.preinitiation }${ LayerStatusTypeValues.types.project.privateSubproject }`)
                    , where("typeStatus", "<",  `${ LayerStatusTypeValues.layers.project }${ LayerStatusTypeValues.statuses.closed }${ LayerStatusTypeValues.types.project.privateSubproject }`)
                    , where("involved", "array-contains", userId)
                )
                , (snapshot) => {
                    const promises = snapshot.docChanges()
                        .map(change => {
                            const taskId = change.doc.id;
                            const taskData = change.doc.data() as FSTask;
                            return ChangedTask[change.type]({ id: taskId, item: convert(taskId, taskData) } );
                            // childrenを取得する場合をメモのために残しておく
                            // return getDocs(
                            //     query(
                            //         collection(this.#db, CollectionType.tasks)
                            //         // indexの前方一致
                            //         , where("ancestorIds", ">=", `${ taskData.ancestorIds || "" }${ taskId }`)
                            //         , where("involved", "array-contains", userId)
                            //     )
                            // )
                            //     .then((querySnapshot) => {
                            //         const descendants = new Array<Task>();
                            //         querySnapshot.forEach(doc => {
                            //             const taskData = doc.data() as FSTask;
                            //             descendants.push(convert(taskData.id, taskData));
                            //         });
                            //         // logsを取得する
                            //         return getDocs(
                            //             query(
                            //                 collectionGroup(this.#db, CollectionType.logs)
                            //                 // タスクの arrange時、log の ancestorIds も操作する必要がある
                            //                 , where("ancestorIds", ">=", `${ taskData.ancestorIds || "" }${ taskId }`)
                            //                 , orderBy("ancestorIds")
                            //                 , orderBy("startedAt", "desc")
                            //             )
                            //         )
                            //             .then(querySnapshot => {
                            //                 const logs = new Array<Log>();
                            //                 querySnapshot.forEach(doc => {
                            //                     const logData = doc.data() as FSLog;
                            //                     logs.push(convertLog(logData));
                            //                 });
                            //                 return ChangedTask[change.type]({ id: taskId, item: convert(taskId, taskData, logs, descendants)} );
                            //             });
                            //     });
                        });

                    Promise
                        .all(promises)
                        .then((changedItems) => subscriber.next(changedItems))
                        .catch((error) => subscriber.error(error));
                });
            this.unsubscribers.push(unsubscribe);
        });
    }
    
    observeProject(userId: string, projectId: string): Observable<Task> {
        const taskCollectionRef = collection(this.#db, CollectionType.tasks);
        const unsubscribes: Unsubscribe[] = [];
        return new Observable(subscriber => {
            let projctData: FSTask;
            let descendants: Task[];
            let logs: Log[];

            new Promise<void>((resolve) => {
                const unsubscribe = onSnapshot(
                    /**
                     * セキュリティルール（以下）にてユーザがそのプロジェクトを見られるか判断させている。
                     * match /tasks/{taskId} {
                     *     allow read, update, delete: if request.auth != null && request.auth.uid in resource.data.involved;
                     *     allow read: if request.auth != null && resource.data.invitationIds != null;
                     *     allow create: if request.auth != null;
                     *           
                     *     match /logs/{logId} {
                     *         allow read, write: if request.auth != null && request.auth.uid in get(/databases/$(database)/documents/tasks/$(taskId)).data.involved;
                     *     }
                     * }
                     */
                    doc(taskCollectionRef, projectId)
                    , (snapshot: DocumentSnapshot<DocumentData>) => {
                        const _projctData = snapshot.data() as FSTask;
                        if (!projctData) {
                            projctData = _projctData;
                            resolve();
                        } else {
                            projctData = _projctData;
                        }
                    });
                unsubscribes.push(unsubscribe);
            })
                .then(() => {
                    return new Promise<void>((resolve) => {
                        const unsubscribe = onSnapshot(
                            query(
                                taskCollectionRef
                                , where("ancestorIds", ">=", `${ projctData.ancestorIds || "" }${ projectId }`)
                                , where("involved", "array-contains", userId)
                            )
                            , (snapshot) => {
                                if (!descendants) {
                                    const _descendants = new Array<Task>();
                                    snapshot.forEach(doc => {
                                        const taskData = doc.data() as FSTask;
                                        _descendants.push(convert(taskData.id, taskData));
                                    });
                                    descendants = _descendants;
                                    resolve();
                                } else {
                                    snapshot.docChanges()
                                        .map(change => {
                                            const taskId = change.doc.id;
                                            const taskData = change.doc.data() as FSTask;
                                            // TODO
                                            switch (change.type) {
                                            case ItemChangeType.added: {
                                                descendants.unshift(convert(taskId, taskData));
                                                break;
                                            }
                                            case ItemChangeType.modified: {
                                                for (let i = 0, imax = descendants.length; i < imax; i++) {
                                                    if (descendants[i].id === taskId) {
                                                        descendants.splice(i, 1, convert(taskId, taskData));
                                                        break;
                                                    }
                                                }
                                                break;
                                            }
                                            case ItemChangeType.removed: {
                                                for (let i = 0, imax = descendants.length; i < imax; i++) {
                                                    if (descendants[i].id === taskId) {
                                                        descendants.splice(i, 0);
                                                        break;
                                                    }
                                                }
                                                break;
                                            }
                                            }
                                        });
                                }
                            });
                        unsubscribes.push(unsubscribe);
                    });
                })
                .then(() => {
                    // logsを取得する
                    return new Promise<void>((resolve) => {
                        const unsubscribe = onSnapshot(
                            query(
                                collectionGroup(this.#db, CollectionType.logs)
                                // タスクの arrange時、log の ancestorIds も操作する必要がある
                                , where("ancestorIds", ">=", `${ projctData.ancestorIds || "" }${ projectId }`)
                                , orderBy("ancestorIds")
                                , orderBy("startedAt", "desc")
                            )
                            , (snapshot => {
                                if (!logs) {
                                    const _logs = new Array<Log>();
                                    snapshot.forEach(doc => {
                                        const logData = doc.data() as FSLog;
                                        _logs.push(convertLog(logData));
                                    });
                                    logs = _logs;
                                    resolve();
                                } else {
                                    snapshot.docChanges()
                                        .map(change => {
                                            const logId = change.doc.id;
                                            const logData = change.doc.data() as FSLog;
                                            // TODO
                                            switch (change.type) {
                                            case ItemChangeType.added: {
                                                logs.unshift(convertLog(logData));
                                                break;
                                            }
                                            case ItemChangeType.modified: {
                                                for (let i = 0, imax = logs.length; i < imax; i++) {
                                                    if (logs[i].id === logId) {
                                                        logs.splice(i, 1, convertLog(logData));
                                                        break;
                                                    }
                                                }
                                                break;
                                            }
                                            case ItemChangeType.removed: {
                                                for (let i = 0, imax = logs.length; i < imax; i++) {
                                                    if (logs[i].id === logId) {
                                                        logs.splice(i, 0);
                                                        break;
                                                    }
                                                }
                                                break;
                                            }
                                            }
                                        });
                                }
                            })
                        );
                        unsubscribes.push(unsubscribe);
                    });   
                })
                .then(() => {
                    // 初めて全部が揃った時
                    subscriber.next(convert(projectId, projctData, logs, descendants));
                })
                .catch((error) => subscriber.error(error));
        });
    }
}