import { Backend, ChangedItem } from "@/shared/service/domain/interfaces/backend";
import { Task } from "@/shared/service/domain/models/task";
import { collection, addDoc, Firestore, onSnapshot } from "firebase/firestore";
import { Observable } from "rxjs";

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
    observeTasks(userId: string): Observable<ChangedItem<Task>[]> {
        return new Observable(subscriber => {

            onSnapshot(doc(this.#db, CollectionType.tasks))

            const unsubscribe = this.#db
                .collection(CollectionType.tasks)
                // Closed含まない: A1 <= x < Z1
                .where("typeStatus", ">=", `${ LayerTypeStatus.task }${ LayerTypeStatus.preinitiation }${ LayerTypeStatus.todo }`)
                .where("typeStatus", "<", `${ LayerTypeStatus.task }${ LayerTypeStatus.closed }${ LayerTypeStatus.todo }`)
                .where("involved", "array-contains", userId)
                .onSnapshot(snapshot => {
                    const changedItems = snapshot.docChanges()
                        .map(change => {
                            const taskId = change.doc.id;
                            const taskData = change.doc.data() as FSTask;
                            // ここで Work を取ってくると見ないタスクのものまで取ってきてしまうのでやらないこと
                            return {
                                kind: itemChangeTypeFrom(change.type)
                                , id: taskId
                                , item: convert(taskId, taskData)
                            };
                        });
                    subscriber.next(changedItems);
                });
            this.unsubscribers.push(unsubscribe);
        });
    }
}