import { Observable } from "rxjs";
import { SwiftEnum, SwiftEnumCases } from "@/shared/system/utils/enum";
import { Task } from "../entities/task";
import { Warranty } from "../entities/warranty";

export const ItemChangeType = {
    "added" : "added"
    , "modified" : "modified"
    , "removed" : "removed"
} as const;

type ItemChangeType<T> = {
    [ItemChangeType.added] : { id: string; item: T; };
    [ItemChangeType.modified] : { id: string; item: T; };
    [ItemChangeType.removed] : { id: string; };
};

export const ChangedTasks = new SwiftEnum<ItemChangeType<Task>>();
export type ChangedTask = SwiftEnumCases<ItemChangeType<Task>>;

export interface Backend {

    /**
     * ユーザのタスクを観測し、変更を通知します。
     */
    observeTasks: (userId: string) => Observable<ChangedTask[]>;

    // getWarranties: () => Observable<Warranty[]|null>;
}