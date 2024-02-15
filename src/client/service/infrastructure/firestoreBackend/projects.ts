import { ChangedTask, ItemChangeType, ProjectFunctions } from "@/shared/service/domain/interfaces/backend";
import {  LayerStatusTypeValues } from "./entities/tasks";
import { CollectionType } from ".";

import { addDoc, collection, collectionGroup, doc, DocumentChangeType, Firestore, getDocs, onSnapshot, orderBy, where, query, DocumentSnapshot, DocumentData, Unsubscribe } from "firebase/firestore";
import { Observable } from "rxjs";
import { taskConverter } from "./tasks";

export function createProjectFunctions(db: Firestore, unsubscribers: Array<() => void>): ProjectFunctions {
    return {
        /**
         * ユーザのプロジェクトの一覧を返します。childrenは取得しません。
         * @param userId 
         */
        observeUsersProjects: (userId: string): Observable<ChangedTask[]> => {
            return new Observable(subscriber => {
                const unsubscribe = onSnapshot(
                    query(
                        collection(db, CollectionType.tasks).withConverter(taskConverter)
                        , where("typeStatus", ">=", `${ LayerStatusTypeValues.layers.project }${ LayerStatusTypeValues.statuses.preinitiation }${ LayerStatusTypeValues.types.project.privateSubproject }`)
                        , where("typeStatus", "<",  `${ LayerStatusTypeValues.layers.project }${ LayerStatusTypeValues.statuses.closed }${ LayerStatusTypeValues.types.project.privateSubproject }`)
                        , where("involved", "array-contains", userId)
                    )
                    , (snapshot) => {
                        const promises = snapshot.docChanges()
                            .map(change => {
                                const taskId = change.doc.id;
                                const task = change.doc.data();
                                return ChangedTask[change.type]({ id: taskId, item: task } );
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
                unsubscribers.push(unsubscribe);
                return () => unsubscribe();
            });
        }
        /*
        , observe: (userId: string, projectId: string): Observable<Task> => {
            const taskCollectionRef = collection(db, CollectionType.tasks).withConverter(taskConverter);
            const unsubscribes: Unsubscribe[] = [];
            return new Observable(subscriber => {
                let projctData: TaskProperties;
                let descendants: TaskProperties[];
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
                         * /
                        doc(taskCollectionRef, projectId)
                        , (snapshot: DocumentSnapshot<TaskProperties>) => {
                            const _projctData = snapshot.data();
                            if (!projctData && _projctData) {
                                projctData = _projctData;
                                resolve();
                            } else if (_projctData){
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
                                        const _descendants = new Array<TaskProperties>();
                                        snapshot.forEach(doc => {
                                            const taskProperties = doc.data();
                                            _descendants.push(taskProperties);
                                        });
                                        descendants = _descendants;
                                        resolve();
                                    } else {
                                        snapshot.docChanges()
                                            .map(change => {
                                                const taskId = change.doc.id;
                                                const taskProperties = change.doc.data();
                                                // TODO
                                                switch (change.type) {
                                                case ItemChangeType.added: {
                                                    descendants.unshift(taskProperties);
                                                    break;
                                                }
                                                case ItemChangeType.modified: {
                                                    for (let i = 0, imax = descendants.length; i < imax; i++) {
                                                        if (descendants[i].id === taskId) {
                                                            descendants.splice(i, 1, taskProperties);
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
                                    collectionGroup(db, CollectionType.logs)
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
        }*/
    };
}