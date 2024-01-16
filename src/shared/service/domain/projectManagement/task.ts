import { Observable } from "rxjs";
import dependencies from "../dependencies";
import { ChangedTask } from "../interfaces/backend";
import { Entity } from "@/shared/system/interfaces/architecture";

export interface Nodable {
    id: number;
    parentRef: Nodable|null;
    text: string|null;
    children: Nodable[];
    debug: string;
}

/**
 * タスクタイプ
 */
export const TaskType = {
    // Organization
    publicNpo                        : "publicNpo"
    , publicEdu                      : "publicEdu"
    , publicOrganizationSubscribing  : "publicOrganizationSubscribing"
    , publicOrganization             : "publicOrganization"
    , privateNpo                     : "npo"
    , privateEdu                     : "edu"
    , privateOrganizationSubscribing : "organizationSubscribing"
    , privateOrganization            : "organization"
    // Project
    , publicProject                  : "publicProject"
    , publicSubproject               : "publicSubproject"
    , privateProject                 : "project"
    , privateSubproject              : "subproject"
    // Task
    , milestone                      : "milestone"
    , requirement                    : "requirement"
    , issue                          : "issue"
    , todo                           : "todo"

    , unkown : "unkown"
} as const;

export type TaskType = typeof TaskType[keyof typeof TaskType];

// タスク状態
export const TaskStatus = {
    preinitiation : "preinitiation" // 開始前の仮状態
    , open : "open"
    , backlog : "backlog"
    , closed : "closed"
    , unkown : "unkown"
} as const;

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

export interface Log {
    id: string;
    ancestorIds: string;
    userIds: { [userId: string]: { isActive: boolean; doingId: string }};
    type: string;
    message: string|null;
    startedAt: Date;
    finishedAt: Date|null;
}

// アプリケーションで使用するデータ(参照を追加)
export interface Task {
    id: string;
    type: TaskType;
    status: TaskStatus;

    title: string;
    purpose: string|null;
    goal: string|null;
    instractions: string|null;

    author: string;            // タスクを作ったユーザ
    owner: string;             // タスクのオーナー（作成時はauthor）
    assignees: Array<string>;  // タスクをアサインされたメンバ（オーナーは含まない）
    members: Array<string>;    // タスクの全メンバ（owner、assigneesは必ず包含。作成時はauthorも含むが外すことが可能）
    involved: Array<string>;   // このタスクの全関係者（author, member）

    ancestorIds: string|null;
    _children: Array<string>;
    children: Array<Task>;

    startedAt: Date|null;
    deadline: Date|null;

    logs: Array<Log>;

    templateId?: string;
    lastTimeWorkedAt?: Date;
    createdAt: Date;
}

export type TaskProperties = {
    id: string;
    type: TaskType;
    status: TaskStatus;

    title: string;
    purpose: string|null;
    goal: string|null;
    instractions: string|null;

    author: string;            // タスクを作ったユーザ
    owner: string;             // タスクのオーナー（作成時はauthor）
    assignees: Array<string>;  // タスクをアサインされたメンバ（オーナーは含まない）
    members: Array<string>;    // タスクの全メンバ（owner、assigneesは必ず包含。作成時はauthorも含むが外すことが可能）
    involved: Array<string>;   // このタスクの全関係者（author, member）

    ancestorIds: string|null;
    _children: Array<string>;
    children: Array<Task>;

    startedAt: Date|null;
    deadline: Date|null;

    logs: Array<Log>;

    templateId?: string;
    lastTimeWorkedAt?: Date;
    createdAt: Date;
};

const initialTask = {
    type: TaskType.milestone

};

export class Task implements Entity<TaskProperties> {
    constructor() {}

    static create(): Promise<TaskProperties> {
        return dependencies.backend.tasks.create();
    }
}

export default {
    getAvailableTaskTypes: (task: Task, parent: Task): TaskType[] => {
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
    , observeUsersTasks: (userId: string): Observable<ChangedTask[]> => {
        return dependencies.backend.tasks.observe(userId);
    }
};