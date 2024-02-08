import { Observable } from "rxjs";
import dependencies from "../dependencies";
import { ChangedTask } from "../interfaces/backend";
import { Entity } from "@/shared/system/interfaces/architecture";
import { autoId } from "@/client/service/infrastructure/firestoreBackend";

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

export type TaskDraftProperties = {
    type: TaskType;
    status: TaskStatus;

    title: string;
    purpose?: string | undefined;
    goal?: string | undefined;
    instractions?: string | undefined;

    author?: string | undefined;            // タスクを作ったユーザ
    owner?: Array<string> | undefined;      // タスクのオーナー（作成時はauthor） ownerでないと、project/subprojectはdeleteできない
    assignees?: Array<string> | undefined;  // タスクをアサインされたメンバ（オーナーは含まない）
    members?: Array<string> | undefined;    // タスクの全メンバ（owner、assigneesは必ず包含。作成時はauthorも含むが外すことが可能）
    involved?: Array<string> | undefined;   // このタスクの全関係者（author, member）

    ancestorIds?: string | undefined;
    children?: Array<TaskDraftProperties> | undefined; // 子がない場合は明確に空配列を入れる

    startedAt?: Date | undefined;
    deadline?: Date | undefined;

    templateId?: undefined;
};

export type TaskProperties = {
    id: string;
    type: TaskType;
    status: TaskStatus;

    title: string;
    purpose: string | null;
    goal: string | null;
    instractions: string | null;

    author: string;            // タスクを作ったユーザ
    owner?: Array<string> | undefined;      // タスクのオーナー（作成時はauthor） ownerでないと、project/subprojectはdeleteできない
    assignees: Array<string>;  // タスクをアサインされたメンバ（オーナーは含まない）
    members: Array<string>;    // タスクの全メンバ（owner、assigneesは必ず包含。作成時はauthorも含むが外すことが可能）
    involved: Array<string>;   // このタスクの全関係者（author, member）

    ancestorIds: string | null;
    children: Array<TaskProperties>; // 子がない場合は明確に空配列を入れる
    childrenIds: Array<string>;      // Firestoreからの取得時、UserTasksなど、実態が取得できない場合があるため、IDのみを保持する

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

export class TaskDraft implements Entity<TaskDraftProperties> {
    private _properties: TaskDraftProperties;
    private _id: string;
    private _userId: string;
    
    constructor(userId: string, properties: TaskDraftProperties) {
        this._properties = properties;
        this._id = autoId();
        this._userId = userId;
    }

    toTaskProperties(): TaskProperties {
        const children = this._properties.children?.map(child => new TaskDraft(this._userId, child).toTaskProperties()) || [];
        return {
            id: this._id
            , type: this._properties.type
            , status: this._properties.status
            , title: this._properties.title
            , purpose: this._properties.purpose || null
            , goal: this._properties.goal || null
            , instractions: this._properties.instractions || null
            , author: this._properties.author || this._userId
            , owner: this._properties.owner || this._userId
            , assignees: this._properties.assignees || []
            , members: this._properties.members || [this._userId]
            , involved: this._properties.involved || [this._userId]
            , ancestorIds: this._properties.ancestorIds || null
            , children
            , childrenIds: children.map(child => child.id)
            , startedAt: this._properties.startedAt || null
            , deadline: this._properties.deadline || null
            , templateId: this._properties.templateId
            , lastTimeWorkedAt: undefined
            , updatedAt: undefined
            , createdAt: null
        };
    }
}

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
        
        const createTutorialTasks = (): TaskDraftProperties => {
            return {
                type: TaskType.milestone
                , status: TaskStatus.open
                , title: "チュートリアルを完了する"
                , purpose: "Joynの使い方を理解する"
                , goal: "サブタスクをすべて完了する"
                , author: userId
                , owner: [userId]
                , assignees: [userId]
                , members: [userId]
                , involved: [userId]
                , children: [
                    {
                        type: TaskType.requirement
                        , status: TaskStatus.open
                        , title: "ドラッグ＆ドロップでタスクを移動する"
                        , purpose: "タスク移動の自由度を理解する"
                        , goal: "タスクの組み換えを体験する"
                        , author: userId
                        , assignees: [userId]
                        , members: [userId]
                        , involved: [userId]
                    }
                    , {
                        type: TaskType.requirement
                        , status: TaskStatus.open
                        , title: "タスク名を変更する"
                        , purpose: "Joynの使い方を理解する"
                        , goal: "サブタスクをすべて完了する"
                        , author: userId
                        , assignees: [userId]
                        , members: [userId]
                        , involved: [userId]
                    }
                    , {
                        type: TaskType.requirement
                        , status: TaskStatus.open
                        , title: "タスクを完了する"
                        , purpose: "Joynの使い方を理解する"
                        , goal: "サブタスクをすべて完了する"
                        , author: userId
                        , assignees: [userId]
                        , members: [userId]
                        , involved: [userId]
                        , children: [
                            {
                                type: TaskType.todo
                                , status: TaskStatus.open
                                , title: "タスクを実行中にする"
                                , purpose: "Joynの使い方を理解する"
                                , goal: "サブタスクをすべて完了する"
                                , author: userId
                                , assignees: [userId]
                                , members: [userId]
                                , involved: [userId]
                            }
                        ]
                    }

                ]
            } as TaskDraftProperties;
        };
        
        return dependencies.backend.tasks.create(createTutorialTasks(), userId);
    }

    update(title: string) : Promise<void> {
        return dependencies.backend.tasks.update(this.properties.id, title);
    }

    rearrange(currentParent: TaskProperties, newParent: TaskProperties, index: number) : Promise<void> {
        return dependencies.backend.tasks.rearrange(this.properties, currentParent, newParent, index);
    }
}

