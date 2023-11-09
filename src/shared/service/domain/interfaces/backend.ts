import { Observable } from "rxjs";
import { SwiftEnum, SwiftEnumCases } from "@/shared/system/utils/enum";
import { Task } from "../entities/task";

export const ItemChangeType = {
    added : "added"
    , modified : "modified"
    , removed : "removed"
} as const;

export type ItemChangeType = typeof ItemChangeType[keyof typeof ItemChangeType];

// これだと入力補完が利かないので
// export type ChangedItems<T> = {
//     [ItemChangeType.added] : { id: string; item: T; };
//     [ItemChangeType.modified] : { id: string; item: T; };
//     [ItemChangeType.removed] : { id: string; };
// };
// こうする
export type ChangedItems<T> = {
    added : { id: string; item: T; };
    modified : { id: string; item: T; };
    removed : { id: string; };
};

export const ChangedTask = new SwiftEnum<ChangedItems<Task>>();
export type ChangedTask = SwiftEnumCases<ChangedItems<Task>>;

export interface Backend {

    /**
     * ユーザのタスクを観測し、変更を通知します。
     */
    observeTasks: (userId: string) => Observable<ChangedTask[]>;

    /**
     * ユーザのプロジェクトを取得します。
     * @param userId 
     * @param projectId 
     */
    observeUsersProjects(userId: string): Observable<ChangedTask[]>;

    observeProject(userId: string, projectId: string): Observable<Task>;

    // getWarranties: () => Observable<Warranty[]|null>;
}