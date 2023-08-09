import { Log, Task, TaskStatus, TaskType } from "@/shared/service/domain/entities/task";
import { FieldValue, Timestamp } from "firebase/firestore";

export const LayerTypeStatusValues = {
    /* layer */
    organization : "O"
    , project    : "P"
    , task       : "T"

    /* type */
    , publicNpo                      : "z00"
    , publicEdu                      : "y00"
    , publicOrganizationSubscribing  : "n00"
    , publicOrganization             : "a00"
    , privateNpo                     : "900"
    , privateEdu                     : "800"
    , privateOrganizationSubscribing : "500"
    , privateOrganization            : "100"

    , publicProject     : "n0"
    , publicSubproject  : "a0"
    , privateProject    : "50"
    , privateSubproject : "10"

    , milestone         : "9"
    , requirement       : "8"
    , issue             : "5"
    , todo              : "1"

    /* status */
    , preinitiation     : "A"
    , open              : "B"
    , backlog           : "N"
    , closed            : "Z"
} as const;

export type LayerTypeStatusValues = typeof LayerTypeStatusValues[keyof typeof LayerTypeStatusValues];

export type LayerTypeStatus = string;

export function encodeTypeAndStatus(type: TaskType, status: TaskStatus): LayerTypeStatus {
    let _layer: LayerTypeStatusValues;
    let _type: LayerTypeStatusValues;
    let _status: LayerTypeStatusValues;

    switch(type) {
    case TaskType.publicNpo: {
        _layer = LayerTypeStatusValues.organization;
        _type = LayerTypeStatusValues.publicNpo;
        break;
    }
    case TaskType.publicEdu: {
        _layer = LayerTypeStatusValues.organization;
        _type = LayerTypeStatusValues.publicEdu;
        break;
    }
    case TaskType.publicOrganizationSubscribing: {
        _layer = LayerTypeStatusValues.organization;
        _type = LayerTypeStatusValues.publicOrganizationSubscribing;
        break;
    }
    case TaskType.publicOrganization: {
        _layer = LayerTypeStatusValues.organization;
        _type = LayerTypeStatusValues.publicOrganization;
        break;
    }
    case TaskType.privateNpo: {
        _layer = LayerTypeStatusValues.organization;
        _type = LayerTypeStatusValues.privateNpo;
        break;
    }
    case TaskType.privateEdu: {
        _layer = LayerTypeStatusValues.organization;
        _type = LayerTypeStatusValues.privateEdu;
        break;
    }
    case TaskType.privateOrganizationSubscribing: {
        _layer = LayerTypeStatusValues.organization;
        _type = LayerTypeStatusValues.privateOrganizationSubscribing;
        break;
    }
    case TaskType.privateOrganization: {
        _layer = LayerTypeStatusValues.organization;
        _type = LayerTypeStatusValues.privateOrganization;
        break;
    }
    case TaskType.publicProject: {
        _layer = LayerTypeStatusValues.project;
        _type = LayerTypeStatusValues.publicProject;
        break;
    }
    case TaskType.publicSubproject: {
        _layer = LayerTypeStatusValues.project;
        _type = LayerTypeStatusValues.publicSubproject;
        break;
    }
    case TaskType.privateProject: {
        _layer = LayerTypeStatusValues.project;
        _type = LayerTypeStatusValues.privateProject;
        break;
    }
    case TaskType.privateSubproject: {
        _layer = LayerTypeStatusValues.project;
        _type = LayerTypeStatusValues.privateSubproject;
        break;
    }
    case TaskType.milestone: {
        _layer = LayerTypeStatusValues.task;
        _type = LayerTypeStatusValues.milestone;
        break;
    }
    case TaskType.requirement: {
        _layer = LayerTypeStatusValues.task;
        _type = LayerTypeStatusValues.requirement;
        break;
    }
    case TaskType.issue: {
        _layer = LayerTypeStatusValues.task;
        _type = LayerTypeStatusValues.issue;
        break;
    }
    case TaskType.todo: {
        _layer = LayerTypeStatusValues.task;
        _type = LayerTypeStatusValues.todo;
        break;
    }
    default: {
        throw new Error();
    }
    }

    switch(status) {
    case TaskStatus.preinitiation: {
        _status = LayerTypeStatusValues.preinitiation;
        break;
    }
    case TaskStatus.open: {
        _status = LayerTypeStatusValues.open;
        break;
    }
    case TaskStatus.backlog: {
        _status = LayerTypeStatusValues.backlog;
        break;
    }
    case TaskStatus.closed: {
        _status = LayerTypeStatusValues.closed;
        break;
    }
    default: {
        throw new Error();
    }
    }

    return `${ _layer }${ _status }${ _type }`;
}

export function decodeTypeAndStatus(value: LayerTypeStatus): [ TaskType, TaskStatus ] {
    let type: TaskType = TaskType.unkown;
    let status: TaskStatus = TaskStatus.unkown;
    
    switch(value.slice(2)) {
    case LayerTypeStatusValues.publicNpo: {
        type = TaskType.publicNpo;
        break;
    }
    case LayerTypeStatusValues.publicEdu: {
        type = TaskType.publicEdu;
        break;
    }
    case LayerTypeStatusValues.publicOrganizationSubscribing: {
        type = TaskType.publicOrganizationSubscribing;
        break;
    }
    case LayerTypeStatusValues.publicOrganization: {
        type = TaskType.publicOrganization;
        break;
    }
    case LayerTypeStatusValues.privateOrganization: {
        type = TaskType.privateOrganization;
        break;
    }
    case LayerTypeStatusValues.privateNpo: {
        type = TaskType.privateNpo;
        break;
    }
    case LayerTypeStatusValues.privateEdu: {
        type = TaskType.privateEdu;
        break;
    }
    case LayerTypeStatusValues.privateOrganizationSubscribing: {
        type = TaskType.privateOrganizationSubscribing;
        break;
    }
    case LayerTypeStatusValues.publicProject: {
        type = TaskType.publicProject;
        break;
    }
    case LayerTypeStatusValues.publicSubproject: {
        type = TaskType.publicSubproject;
        break;
    }
    case LayerTypeStatusValues.privateProject: {
        type = TaskType.privateProject;
        break;
    }
    case LayerTypeStatusValues.privateSubproject: {
        type = TaskType.privateSubproject;
        break;
    }
    case LayerTypeStatusValues.milestone: {
        type = TaskType.milestone;
        break;
    }
    case LayerTypeStatusValues.requirement: {
        type = TaskType.requirement;
        break;
    }
    case LayerTypeStatusValues.issue: {
        type = TaskType.issue;
        break;
    }
    case LayerTypeStatusValues.todo: {
        type = TaskType.todo;
        break;
    }
    default: {
        console.log("value", value, "value.slice(2)", value.slice(2));
        throw new Error();
    }

    }
    switch(value.slice(1, 2)) {
    case LayerTypeStatusValues.preinitiation: {
        status = TaskStatus.preinitiation;
        break;
    }
    case LayerTypeStatusValues.open: {
        status = TaskStatus.open;
        break;
    }
    case LayerTypeStatusValues.backlog: {
        status = TaskStatus.backlog;
        break;
    }
    case LayerTypeStatusValues.closed: {
        status = TaskStatus.closed;
        break;
    }
    default: {
        console.log("value", value, "value.slice(1, 2)", value.slice(1, 2));
        throw new Error();
    }
    }

    return [ type, status ];
}


export interface FSTask {
    id: string;
    typeStatus: LayerTypeStatus;

    title: string;
    purpose: string|null;
    goal: string|null;
    instractions: string|null;

    author: string;
    owner: string;
    assignees: Array<string>;
    members: Array<string>;
    involved: Array<string>;

    ancestorIds: string|null;
    children: Array<string>;

    invitationIds?: Array<string>;
    invitations?: Array<FSInvitation>;

    startedAt: Timestamp|null;
    deadline?: Timestamp|null;

    lastTimeWorkedAt?: Timestamp|FieldValue;
    createdAt: Timestamp|FieldValue;
}

export interface FSInvitation {
    id: string;
    taskId: string;
    summarizedTask: string;
    inviterId: string;
    expirationAt: Timestamp;
    // isInvalidated: boolean;
    waitingList: Array<string>;
    createdAt: Timestamp;
}

export interface FSLog {
    id: string;
    ancestorIds: string;
    userIds: { [userId: string]: { isActive: boolean; doingId: string }};
    type: string;
    message: string|null;
    startedAt: Timestamp;
    finishedAt: Timestamp|null;
}

const convertTimestamp = (t: Timestamp|FieldValue|null): Date => {
    if (t === null || t instanceof FieldValue) {
        return new Date();
    } else {
        return t.toDate();
    }
};

export function convert(id: string, task: FSTask, logs: Log[]|null = [], descendants: Task[]|null = null): Task {

    let _descendants = new Array<Task>();
    if (descendants !== null) {
        const recursive = (arr: string[]) => {
            return arr.reduce((result, id) => {
                const task = descendants.find(t => t.id === id);
                if (task) {
                    result.push(task);
                    if (task._children.length > 0) {
                        task.children = recursive(task._children);
                    }
                }
                return result;
            }, new Array<Task>());
        };
        _descendants = recursive(task.children);
    }

    const [type, status] = decodeTypeAndStatus(task.typeStatus);

    return {
        id
        , type
        , status
        , title: task.title
        , purpose: task.purpose
        , goal: task.goal
        , instractions: task.instractions

        , author: task.author
        , owner: task.owner
        , assignees: task.assignees
        , members: task.members
        , involved: task.involved

        , ancestorIds: task.ancestorIds
        , _children: task.children
        , children: _descendants

        , startedAt: task.startedAt ? task.startedAt.toDate() : null
        , deadline: task.deadline  ? task.deadline.toDate() : null

        , logs: logs ? logs : []

        , lastTimeWorkedAt: task.lastTimeWorkedAt ? convertTimestamp(task.lastTimeWorkedAt) : undefined
        , createdAt: convertTimestamp(task.createdAt)
    } as Task;
}