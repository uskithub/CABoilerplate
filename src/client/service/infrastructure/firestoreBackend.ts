import { Backend, ChangedTask, ChangedTasks } from "@/shared/service/domain/interfaces/backend";
import { addDoc, collection, collectionGroup, doc, DocumentChangeType, Firestore, getDocs, onSnapshot, orderBy, where, query } from "firebase/firestore";
import { Observable } from "rxjs";
import { convert, convertLog, FSLog, FSTask, LayerStatusTypeValues } from "./entities/tasks";
import { Log, Task } from "@/shared/service/domain/entities/task";

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
                            return ChangedTasks[change.type]({ id: taskId, item: convert(taskId, taskData) });
                        });
                    subscriber.next(changedItems);
                });
            
            this.unsubscribers.push(unsubscribe);
        });
    }

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
                            return getDocs(
                                query(
                                    collection(this.#db, CollectionType.tasks)
                                    // indexの前方一致
                                    , where("ancestorIds", ">=", `${ taskData.ancestorIds || "" }${ taskId }`)
                                    , where("involved", "array-contains", userId)
                                )
                            )
                                .then((querySnapshot) => {
                                    const descendants = new Array<Task>();
                                    querySnapshot.forEach(doc => {
                                        const taskData = doc.data() as FSTask;
                                        descendants.push(convert(taskData.id, taskData));
                                    });
                                    // logsを取得する
                                    return getDocs(
                                        query(
                                            collectionGroup(this.#db, CollectionType.logs)
                                            // タスクの arrange時、log の ancestorIds も操作する必要がある
                                            , where("ancestorIds", ">=", `${ taskData.ancestorIds || "" }${ taskId }`)
                                            , orderBy("ancestorIds")
                                            , orderBy("startedAt", "desc")
                                        )
                                    )
                                        .then(querySnapshot => {
                                            const logs = new Array<Log>();
                                            querySnapshot.forEach(doc => {
                                                const logData = doc.data() as FSLog;
                                                logs.push(convertLog(logData));
                                            });
                                            return ChangedTasks[change.type]({ id: taskId, item: convert(taskId, taskData, logs, descendants)} );
                                        });
                                });
                        });

                    Promise
                        .all(promises)
                        .then((changedItems) => subscriber.next(changedItems))
                        .catch((error) => subscriber.error(error));
                });
            this.unsubscribers.push(unsubscribe);
        });
    }
    
    // observeProject(userId: string, projectId: string): Observable<ChangedTask[]> {
        
    // }
}