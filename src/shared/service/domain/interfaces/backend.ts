import { Observable } from "rxjs";
import { SwiftEnum, SwiftEnumCases } from "@/shared/system/utils/enum";
import { Task, TaskProperties } from "../taskManagement/task";
import { Account, OrganizationAndRole, UserProperties } from "../authentication/user";
import { OrganizationProperties } from "../authentication/organization";
import { ConductProperties } from "../timeline/conduct";
import { ErrorContextFactory } from "@/shared/system/systemErrors";

const BackendErrorDef = {
    BKE0001: "Permission Denied"
    , SYSTEM : "Unhandled Error"
} as const;

export const BackendErrors = new ErrorContextFactory("Backend", BackendErrorDef);

export const ItemChangeType = {
    added: "added"
    , modified: "modified"
    , removed: "removed"
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
    added: { id: string; item: T; };
    modified: { id: string; item: T; };
    removed: { id: string; };
};

export const ChangedTask = new SwiftEnum<ChangedItems<TaskProperties>>();
export type ChangedTask = SwiftEnumCases<ChangedItems<TaskProperties>>;

export type UserFunctions = {
    create: (user: Account, organizationAndRole?: OrganizationAndRole | undefined) => Promise<UserProperties>;
    getObservable: (userId: string) => Observable<UserProperties | null>;
    // update: () => Promise<void>;
    // delete: () => Promise<void>;
};

export const ChangedConduct = new SwiftEnum<ChangedItems<ConductProperties>>();
export type ChangedConduct = SwiftEnumCases<ChangedItems<ConductProperties>>;

export type ConductFunctions = {
    record: (userId: string, to: string | null, mention: string[] | null, text: string) => Promise<ConductProperties>;
    getObservable: (userId: string, followeeIds: string[], groupIds: string[], isAdministrator: boolean) => Observable<ChangedConduct[]>;
};

export type OrganizationFunctions = {
    get: (domain: string) => Promise<OrganizationProperties | null>;
    create: (domain: string, ownerId: string) => Promise<OrganizationProperties>;
};

export type TaskFunctions = {
    /**
     * ユーザのタスクを観測し、変更を通知します。
     */
    getObservable(userId: string): Observable<ChangedTask[]>;

    /**
     * ユーザのタスクを取得します。
     */
    create: (task: TaskProperties) => Promise<TaskProperties>;

    update: (taskId: string, title: string) => Promise<void>;
};

export type ProjectFunctions = {
    /**
     * ユーザのプロジェクトを取得します。
     * @param userId 
     * @param projectId 
     */
    observeUsersProjects(userId: string): Observable<ChangedTask[]>
    observe(userId: string, projectId: string): Observable<Task>
};

export interface Backend {
    users: UserFunctions;
    conducts: ConductFunctions;
    organizations: OrganizationFunctions;
    tasks: TaskFunctions;
    projects: ProjectFunctions;
}