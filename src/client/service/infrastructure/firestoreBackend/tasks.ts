import { ChangedTask, TaskFunctions } from "@/shared/service/domain/interfaces/backend";
import { convert, convertLog, FSLog, FSTask, LayerStatusTypeValues } from "./entities/tasks";
import { CollectionType } from "./firestoreBackend";
import { Log, Task } from "@/shared/service/domain/entities/task";

import { collection, Firestore, onSnapshot, where, query } from "firebase/firestore";
import { Observable } from "rxjs";

export function createTaskFunctions(db: Firestore, unsubscribers: Array<() => void>): TaskFunctions {
    return {
        /**
         * ユーザがInvolvedにいて、Closeされていない、Project以外のタスクを返す
         * @param userId
         * @returns
         */
        observe: (userId: string): Observable<ChangedTask[]> => {
            return new Observable(subscriber => {
                const unsubscribe = onSnapshot(
                    query(
                        collection(db, CollectionType.tasks)
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
            
                unsubscribers.push(unsubscribe);
            });
        }
    };
}
