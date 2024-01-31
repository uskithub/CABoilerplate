import { Observable } from "rxjs";
import dependencies from "../dependencies";
import { ChangedTask } from "../interfaces/backend";
import { Entity } from "@/shared/system/interfaces/architecture";

export interface Nodable {
    id: number;
    parentRef: Nodable | null;
    text: string | null;
    children: Nodable[];
    debug: string;
}

/**
 * タスクタイプ
 */
export const TaskType = {
    // Organization
    publicNpo: "publicNpo"
    , publicEdu: "publicEdu"
    , publicOrganizationSubscribing: "publicOrganizationSubscribing"
    , publicOrganization: "publicOrganization"
    , privateNpo: "npo"
    , privateEdu: "edu"
    , privateOrganizationSubscribing: "organizationSubscribing"
    , privateOrganization: "organization"
    // Project
    , publicProject: "publicProject"
    , publicSubproject: "publicSubproject"
    , privateProject: "project"
    , privateSubproject: "subproject"
    // Task
    , milestone: "milestone"
    , requirement: "requirement"
    , issue: "issue"
    , todo: "todo"

    , unkown: "unkown"
} as const;

export type TaskType = typeof TaskType[keyof typeof TaskType];

// タスク状態
export const TaskStatus = {
    preinitiation: "preinitiation" // 開始前の仮状態
    , open: "open"
    , backlog: "backlog"
    , closed: "closed"
    , unkown: "unkown"
} as const;

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

export interface Log {
    id: string;
    ancestorIds: string;
    userIds: { [userId: string]: { isActive: boolean; doingId: string } };
    type: string;
    message: string | null;
    startedAt: Date;
    finishedAt: Date | null;
}

// アプリケーションで使用するデータ(参照を追加)
export interface _Task {
    id: string;
    type: TaskType;
    status: TaskStatus;

    title: string;
    purpose: string | null;
    goal: string | null;
    instractions: string | null;

    author: string;            // タスクを作ったユーザ
    owner: string;             // タスクのオーナー（作成時はauthor）
    assignees: Array<string>;  // タスクをアサインされたメンバ（オーナーは含まない）
    members: Array<string>;    // タスクの全メンバ（owner、assigneesは必ず包含。作成時はauthorも含むが外すことが可能）
    involved: Array<string>;   // このタスクの全関係者（author, member）

    ancestorIds: string | null;
    _children: Array<string>;
    children: Array<Task>;

    startedAt: Date | null;
    deadline: Date | null;

    logs: Array<Log>;

    templateId?: string | undefined;
    lastTimeWorkedAt?: Date | undefined;
    createdAt: Date;
}

export type TaskProperties = {
    id: string;
    type: TaskType;
    status: TaskStatus;

    title: string;
    purpose: string | null;
    goal: string | null;
    instractions: string | null;

    author: string;            // タスクを作ったユーザ
    owner: string;             // タスクのオーナー（作成時はauthor）
    assignees: Array<string>;  // タスクをアサインされたメンバ（オーナーは含まない）
    members: Array<string>;    // タスクの全メンバ（owner、assigneesは必ず包含。作成時はauthorも含むが外すことが可能）
    involved: Array<string>;   // このタスクの全関係者（author, member）

    ancestorIds: string | null;
    children: Array<TaskProperties>; // 子がない場合は明確に空配列を入れる

    startedAt: Date | null;
    deadline: Date | null;

    // logs: Array<Log>;

    templateId?: string;
    lastTimeWorkedAt?: Date;
    updatedAt?: Date;
    createdAt: Date | null;
};

const initialTask = {
    type: TaskType.milestone
    , status: TaskStatus.open
    , title: "チュートリアルを完了する"
    , purpose: "Joynの使い方を理解する"
    , goal: "サブタスクをすべて完了する"
    , instractions: "TODO: サブタスクを完了するための指示を書く"
    // , author: ""            // タスクを作ったユーザ
    // , owner: ""             // タスクのオーナー（作成時はauthor）
    // , assignees: new Array<string>()  // タスクをアサインされたメンバ（オーナーは含まない）
    // , members: new Array<string>()    // タスクの全メンバ（owner、assigneesは必ず包含。作成時はauthorも含むが外すことが可能）
    // , involved: Array<string>()   // このタスクの全関係者（author, member）

    , ancestorIds: null
    , children: new Array<TaskProperties>()

    // , startedAt: Date|null;
    // , deadline: Date|null;
    // , logs: new Array<Log>();
    // , templateId?: string;
    // , lastTimeWorkedAt?: Date;
    , createdAt: null
};

export class Task implements Entity<TaskProperties> {
    private _properties: TaskProperties;

    get properties(): TaskProperties {
        return this._properties;
    }

    set properties(properties: TaskProperties) {
        this._properties = properties;
    }
    
    constructor(properties: TaskProperties) {
        this._properties = properties;
    }

    static getAvailableTaskTypes(task: TaskProperties, parent: TaskProperties): TaskType[] {
        switch (parent.type) {
            case TaskType.todo, TaskType.issue:
                return [
                    TaskType.todo
                ];
            case TaskType.requirement:
                return [
                    TaskType.issue
                    , TaskType.todo
                ];
            default:
                // case TaskType.milestone:
                // case TaskType.publicProject, TaskType.publicSubproject, TaskType.privateProject, TaskType.privateSubproject:
                // case TaskType.publicNpo, TaskType.publicEdu, TaskType.publicOrganizationSubscribing, TaskType.publicOrganization:
                return [
                    TaskType.milestone
                    , TaskType.requirement
                    , TaskType.issue
                    , TaskType.todo
                ];
        }
    }

    static createInitialTasks(userId: string): Promise<TaskProperties> {
        const task = {
            ...initialTask
            , author: userId
            , owner: userId
            , assignees: [userId]
            , members: [userId]
            , involved: [userId]
        } as TaskProperties;

        return dependencies.backend.tasks.create(task);
    }

    update(title: string) : Promise<void> {
        return dependencies.backend.tasks.update(this.properties.id, title);
    }
}

// export default {
//     getAvailableTaskTypes: (task: Task, parent: Task): TaskType[] => {
//         switch (parent.type) {
//             case TaskType.todo, TaskType.issue:
//                 return [
//                     TaskType.todo
//                 ];
//             case TaskType.requirement:
//                 return [
//                     TaskType.issue
//                     , TaskType.todo
//                 ];
//             default:
//                 // case TaskType.milestone:
//                 // case TaskType.publicProject, TaskType.publicSubproject, TaskType.privateProject, TaskType.privateSubproject:
//                 // case TaskType.publicNpo, TaskType.publicEdu, TaskType.publicOrganizationSubscribing, TaskType.publicOrganization:
//                 return [
//                     TaskType.milestone
//                     , TaskType.requirement
//                     , TaskType.issue
//                     , TaskType.todo
//                 ];
//         }
//     }
//     , observeUsersTasks: (userId: string): Observable<ChangedTask[]> => {
//         return dependencies.backend.tasks.observe(userId);
//     }
// };