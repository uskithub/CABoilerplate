import { Observable } from "rxjs";

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

type TaskType = typeof TaskType[keyof typeof TaskType];

// タスク状態
export const TaskStatus = {
    preinitiation : "preinitiation" // 開始前の仮状態
    , open : "open"
    , backlog : "backlog"
    , closed : "closed"
    , unkown : "unkown"
} as const;

type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

// アプリケーションで使用するデータ(参照を追加)
export interface Task {
    id: string;
    type: TaskType;
    status: TaskStatus;

    title: string;
    purpose: string;
    goal: string;
    instractions: string|null;

    author: string;            // タスクを作ったユーザ
    owner: string;             // タスクのオーナー（作成時はauthor）
    assignees: Array<string>;  // タスクをアサインされたメンバ（オーナーは含まない）
    members: Array<string>;    // タスクの全メンバ（owner、assigneesは必ず包含。作成時はauthorも含むが外すことが可能）
    involved: Array<string>;   // このタスクの全関係者（author, member）

    ancestorIds: string|null;
    _children?: Array<string>;
    children: Array<Task>;

    startedAt: Date|null;
    deadline: Date|null;

    logs: Array<Log>;

    templateId?: string;
    lastTimeWorkedAt?: Date;
    createdAt: Date;
}

export default {

    observeUserTasks: (userId: String): Observable
}