import firestore from "firebase/firestore";

export interface FSTask {
    id: string;
    typeStatus: string;

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

    startedAt: firestore.Timestamp|null;
    deadline?: firestore.Timestamp|null;

    lastTimeWorkedAt?: firestore.Timestamp|firestore.FieldValue;
    createdAt: firestore.Timestamp|firestore.FieldValue;
}

export interface FSInvitation {
    id: string;
    taskId: string;
    summarizedTask: string;
    inviterId: string;
    expirationAt: firestore.Timestamp;
    // isInvalidated: boolean;
    waitingList: Array<string>;
    createdAt: firestore.Timestamp;
}

export interface FSLog {
    id: string;
    ancestorIds: string;
    userIds: { [userId: string]: { isActive: boolean; doingId: string }};
    type: string;
    message: string|null;
    startedAt: firestore.Timestamp;
    finishedAt: firestore.Timestamp|null;
}
