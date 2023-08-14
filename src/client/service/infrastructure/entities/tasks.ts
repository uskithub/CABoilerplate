import { Log, Task, TaskStatus, TaskType } from "@/shared/service/domain/entities/task";
import { FieldValue, Timestamp } from "firebase/firestore";

export const LayerStatusTypeValues = {
    /* layer */
    layers : {
        organization : "O"
        , project    : "P"
        , task       : "T"
    }
    
    /* status */
    , statuses : {
        preinitiation       : "A"
        , open              : "B"
        , backlog           : "N"
        , closed            : "Z"
    }
    /* type */
    , types : {
        // organization types
        organization : {
            publicNpo                        : "z00"
            , publicEdu                      : "y00"
            , publicOrganizationSubscribing  : "n00"
            , publicOrganization             : "a00"
            , privateNpo                     : "900"
            , privateEdu                     : "800"
            , privateOrganizationSubscribing : "500"
            , privateOrganization            : "100"
        }
        // project types
        , project : {
            publicProject       : "n0"
            , publicSubproject  : "a0"
            , privateProject    : "50"
            , privateSubproject : "10"
        }
        // task types
        , task : {
            milestone           : "9"
            , requirement       : "8"
            , issue             : "5"
            , todo              : "1"
        }
    }
} as const;

export type LayerStatusType = string;

export function encodeTypeAndStatus(type: TaskType, status: TaskStatus): LayerStatusType {
    let _layer: string;
    let _type: string;
    let _status: string;

    switch(type) {
    case TaskType.publicNpo: {
        _layer = LayerStatusTypeValues.layers.organization;
        _type = LayerStatusTypeValues.types.organization.publicNpo;
        break;
    }
    case TaskType.publicEdu: {
        _layer = LayerStatusTypeValues.layers.organization;
        _type = LayerStatusTypeValues.types.organization.publicEdu;
        break;
    }
    case TaskType.publicOrganizationSubscribing: {
        _layer = LayerStatusTypeValues.layers.organization;
        _type = LayerStatusTypeValues.types.organization.publicOrganizationSubscribing;
        break;
    }
    case TaskType.publicOrganization: {
        _layer = LayerStatusTypeValues.layers.organization;
        _type = LayerStatusTypeValues.types.organization.publicOrganization;
        break;
    }
    case TaskType.privateNpo: {
        _layer = LayerStatusTypeValues.layers.organization;
        _type = LayerStatusTypeValues.types.organization.privateNpo;
        break;
    }
    case TaskType.privateEdu: {
        _layer = LayerStatusTypeValues.layers.organization;
        _type = LayerStatusTypeValues.types.organization.privateEdu;
        break;
    }
    case TaskType.privateOrganizationSubscribing: {
        _layer = LayerStatusTypeValues.layers.organization;
        _type = LayerStatusTypeValues.types.organization.privateOrganizationSubscribing;
        break;
    }
    case TaskType.privateOrganization: {
        _layer = LayerStatusTypeValues.layers.organization;
        _type = LayerStatusTypeValues.types.organization.privateOrganization;
        break;
    }
    case TaskType.publicProject: {
        _layer = LayerStatusTypeValues.layers.project;
        _type = LayerStatusTypeValues.types.project.publicProject;
        break;
    }
    case TaskType.publicSubproject: {
        _layer = LayerStatusTypeValues.layers.project;
        _type = LayerStatusTypeValues.types.project.publicSubproject;
        break;
    }
    case TaskType.privateProject: {
        _layer = LayerStatusTypeValues.layers.project;
        _type = LayerStatusTypeValues.types.project.privateProject;
        break;
    }
    case TaskType.privateSubproject: {
        _layer = LayerStatusTypeValues.layers.project;
        _type = LayerStatusTypeValues.types.project.privateSubproject;
        break;
    }
    case TaskType.milestone: {
        _layer = LayerStatusTypeValues.layers.task;
        _type = LayerStatusTypeValues.types.task.milestone;
        break;
    }
    case TaskType.requirement: {
        _layer = LayerStatusTypeValues.layers.task;
        _type = LayerStatusTypeValues.types.task.requirement;
        break;
    }
    case TaskType.issue: {
        _layer = LayerStatusTypeValues.layers.task;
        _type = LayerStatusTypeValues.types.task.issue;
        break;
    }
    case TaskType.todo: {
        _layer = LayerStatusTypeValues.layers.task;
        _type = LayerStatusTypeValues.types.task.todo;
        break;
    }
    default: {
        throw new Error();
    }
    }

    switch(status) {
    case TaskStatus.preinitiation: {
        _status = LayerStatusTypeValues.statuses.preinitiation;
        break;
    }
    case TaskStatus.open: {
        _status = LayerStatusTypeValues.statuses.open;
        break;
    }
    case TaskStatus.backlog: {
        _status = LayerStatusTypeValues.statuses.backlog;
        break;
    }
    case TaskStatus.closed: {
        _status = LayerStatusTypeValues.statuses.closed;
        break;
    }
    default: {
        throw new Error();
    }
    }

    return `${ _layer }${ _status }${ _type }`;
}

export function decodeTypeAndStatus(value: LayerStatusType): [ TaskType, TaskStatus ] {
    let type: TaskType = TaskType.unkown;
    let status: TaskStatus = TaskStatus.unkown;
    
    switch(value.slice(2)) {
    case LayerStatusTypeValues.types.organization.publicNpo: {
        type = TaskType.publicNpo;
        break;
    }
    case LayerStatusTypeValues.types.organization.publicEdu: {
        type = TaskType.publicEdu;
        break;
    }
    case LayerStatusTypeValues.types.organization.publicOrganizationSubscribing: {
        type = TaskType.publicOrganizationSubscribing;
        break;
    }
    case LayerStatusTypeValues.types.organization.publicOrganization: {
        type = TaskType.publicOrganization;
        break;
    }
    case LayerStatusTypeValues.types.organization.privateOrganization: {
        type = TaskType.privateOrganization;
        break;
    }
    case LayerStatusTypeValues.types.organization.privateNpo: {
        type = TaskType.privateNpo;
        break;
    }
    case LayerStatusTypeValues.types.organization.privateEdu: {
        type = TaskType.privateEdu;
        break;
    }
    case LayerStatusTypeValues.types.organization.privateOrganizationSubscribing: {
        type = TaskType.privateOrganizationSubscribing;
        break;
    }
    case LayerStatusTypeValues.types.project.publicProject: {
        type = TaskType.publicProject;
        break;
    }
    case LayerStatusTypeValues.types.project.publicSubproject: {
        type = TaskType.publicSubproject;
        break;
    }
    case LayerStatusTypeValues.types.project.privateProject: {
        type = TaskType.privateProject;
        break;
    }
    case LayerStatusTypeValues.types.project.privateSubproject: {
        type = TaskType.privateSubproject;
        break;
    }
    case LayerStatusTypeValues.types.task.milestone: {
        type = TaskType.milestone;
        break;
    }
    case LayerStatusTypeValues.types.task.requirement: {
        type = TaskType.requirement;
        break;
    }
    case LayerStatusTypeValues.types.task.issue: {
        type = TaskType.issue;
        break;
    }
    case LayerStatusTypeValues.types.task.todo: {
        type = TaskType.todo;
        break;
    }
    default: {
        console.log("value", value, "value.slice(2)", value.slice(2));
        throw new Error();
    }

    }
    switch(value.slice(1, 2)) {
    case LayerStatusTypeValues.statuses.preinitiation: {
        status = TaskStatus.preinitiation;
        break;
    }
    case LayerStatusTypeValues.statuses.open: {
        status = TaskStatus.open;
        break;
    }
    case LayerStatusTypeValues.statuses.backlog: {
        status = TaskStatus.backlog;
        break;
    }
    case LayerStatusTypeValues.statuses.closed: {
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
    typeStatus: LayerStatusType;

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