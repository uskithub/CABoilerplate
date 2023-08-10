import { Backend, ChangedTask, ChangedTasks } from "@/shared/service/domain/interfaces/backend";
import { collection, addDoc, Firestore, onSnapshot, doc, where, query, DocumentChangeType } from "firebase/firestore";
import { Observable } from "rxjs";
import { convert, FSTask, LayerTypeStatusValues } from "./entities/tasks";

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
                    // Closed含まない: A1 <= x < Z1
                    , where("typeStatus", ">=", `${ LayerTypeStatusValues.task }${ LayerTypeStatusValues.preinitiation }${ LayerTypeStatusValues.todo }`)
                    , where("typeStatus", "<", `${ LayerTypeStatusValues.task }${ LayerTypeStatusValues.closed }${ LayerTypeStatusValues.todo }`)
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
}