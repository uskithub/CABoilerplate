import { Backend, ChangedItem } from "@/shared/service/domain/interfaces/backend";
import { Task } from "@/shared/service/domain/models/task";
import firestore from "firebase/firestore";
import { Observable } from "rxjs";

export class FirestoreBackend implements Backend {
    #db: firestore.Firestore;
    unsubscribers: Array<() => void>; // TODO: サインアウト時に unscribe する

    constructor(db: firestore.Firestore) {
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