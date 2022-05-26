import { Observable } from "rxjs";
import { Task } from "../models/task";

export const enum ItemChangeType {
    added = "added"
    , modified = "modified"
    , removed = "removed"
}

export type AddedItem<T> = { kind: ItemChangeType.added; id: string; item: T }
export type ModifiedItem<T> = { kind: ItemChangeType.modified; id: string; item: T }
export type RemovedItem = { kind: ItemChangeType.removed; id: string }

export type ChangedItem<T> = AddedItem<T>|ModifiedItem<T>|RemovedItem;


export interface Backend {

    observeTasks: (userId: string) => Observable<ChangedItem<Task>[]>;
}