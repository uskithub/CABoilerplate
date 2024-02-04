import { ChangedTask, TaskFunctions } from "@/shared/service/domain/interfaces/backend";
import { convert, convertLog, FSLog, FSTask, LayerStatusTypeValues } from "./entities/tasks";
import { CollectionType, autoId } from ".";
import { Log, Task, TaskDraft, TaskDraftProperties, TaskProperties, TaskStatus, TaskType } from "@/shared/service/domain/taskManagement/task";

import { collection, Firestore, onSnapshot, where, query, writeBatch, FirestoreDataConverter, DocumentData, QueryDocumentSnapshot, Timestamp, FieldValue, SnapshotOptions, DocumentReference, setDoc, doc, serverTimestamp, updateDoc, PartialWithFieldValue } from "firebase/firestore";
import { Observable } from "rxjs";

type LayerStatusType = string;
interface FSTask {
    typeStatus: LayerStatusType;

    title: string;
    purpose: string | null;
    goal: string | null;
    instractions: string | null;

    author: string;
    owner: string;
    assignees: Array<string>;
    members: Array<string>;
    involved: Array<string>;

    ancestorIds: string | null;
    children: Array<string>;

    // invitationIds?: Array<string> | undefined;
    // invitations?: Array<FSInvitation> | undefined;

    startedAt?: Timestamp | undefined;
    deadline?: Timestamp | undefined;

    lastTimeWorkedAt?: Timestamp | undefined;
    updatedAt?: Timestamp | undefined;
    createdAt: Timestamp;
}

const LayerStatusTypeValues = {
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

function encodeTypeAndStatus(type: TaskType, status: TaskStatus): LayerStatusType {
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

function decodeTypeAndStatus(value: LayerStatusType): [ TaskType, TaskStatus ] {
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

const taskConverter: FirestoreDataConverter<TaskProperties> = {
    toFirestore(modelObject: TaskProperties): DocumentData {
        return {
            typeStatus: encodeTypeAndStatus(modelObject.type, modelObject.status)
            , title: modelObject.title
            , purpose: modelObject.purpose
            , goal: modelObject.goal
            , instractions: modelObject.instractions
            , author: modelObject.author
            , owner: modelObject.owner
            , assignees: modelObject.assignees
            , members: modelObject.members
            , involved: modelObject.involved
            , ancestorIds: modelObject.ancestorIds
            , children: modelObject.childrenIds ? modelObject.childrenIds : []
            , startedAt: modelObject.startedAt ? Timestamp.fromDate(modelObject.startedAt) : null
            , deadline: modelObject.deadline ? Timestamp.fromDate(modelObject.deadline) : null
            , templateId: modelObject.templateId || null
            // create時にしか toFirestore が呼ばれない（と思う）ので、更新でしか設定しない以下２つは不要
            // , lastTimeWorkedAt: modelObject.lastTimeWorkedAt ? Timestamp.fromDate(modelObject.lastTimeWorkedAt) : null
            // , updatedAt: modelObject.updatedAt ? Timestamp.fromDate(modelObject.updatedAt) : null
            // 同様に createdAt は必ず serverTimestamp() でOK
            , createdAt: serverTimestamp()
        };
    }
    , fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>, options?: SnapshotOptions | undefined): TaskProperties => {
        const id = snapshot.id;
        const data = snapshot.data(options) as FSTask;
        const [type, status] = decodeTypeAndStatus(data.typeStatus);
        return {
            id
            , type
            , status
            , title: data.title
            , purpose: data.purpose
            , goal: data.goal
            , instractions: data.instractions
            , author: data.author
            , owner: data.owner
            , assignees: data.assignees
            , members: data.members
            , involved: data.involved
            , ancestorIds: data.ancestorIds
            , children: []
            , childrenIds: data.children
            , startedAt: data.startedAt ? data.startedAt.toDate() : null
            , deadline: data.deadline ? data.deadline.toDate() : null
            // , logs: []
            , lastTimeWorkedAt: data.lastTimeWorkedAt ? data.lastTimeWorkedAt.toDate() : undefined
            , updatedAt: data.updatedAt ? data.updatedAt.toDate() : undefined
            , createdAt: data.createdAt.toDate()
        };
    }
};

export function createTaskFunctions(db: Firestore, unsubscribers: Array<() => void>): TaskFunctions {
    const taskCollectionRef = collection(db, CollectionType.tasks).withConverter(taskConverter);
    return {
        /**
         * ユーザがInvolvedにいて、Closeされていない、Project以外のタスクを返す
         * @param userId
         * @returns
         */
        getObservable: (userId: string): Observable<ChangedTask[]> => {
            return new Observable(subscriber => {
                const unsubscribe = onSnapshot(
                    query(
                        taskCollectionRef
                        // Closed含まない: TA1 <= x < TZ1
                        , where("typeStatus", ">=", `${ LayerStatusTypeValues.layers.task }${ LayerStatusTypeValues.statuses.preinitiation }${ LayerStatusTypeValues.types.task.todo }`)
                        , where("typeStatus", "<",  `${ LayerStatusTypeValues.layers.task }${ LayerStatusTypeValues.statuses.closed }${ LayerStatusTypeValues.types.task.todo }`)
                        , where("involved", "array-contains", userId)
                    )
                    , (snapshot) => {
                        const changedItems = snapshot.docChanges()
                            .map(change => {
                                const id = change.doc.id;
                                const item = change.doc.data();
                                // ここで Work を取ってくると見ないタスクのものまで取ってきてしまうのでやらないこと
                                return ChangedTask[change.type]({ id, item });
                            });
                        subscriber.next(changedItems);
                    });
            
                unsubscribers.push(unsubscribe);
                return () => unsubscribe();
            });
        }

        , create: (taskDraft: TaskDraftProperties, userId: string): Promise<TaskProperties> => {
            const batch = writeBatch(db);

            /**
             * ツリー構造のタスクをバッチ処理します。
             * @returns IDやcreatedAtを設定して返します。
             */
            const _recursive = (taskDraft: TaskDraftProperties, createdAt: Date = new Date(), ancestorIds: string | null = null): TaskProperties => {
                const id = autoId();
                const nextAncestorIds = (ancestorIds || "") + id;

                const node = {
                    id
                    , type: taskDraft.type
                    , status: taskDraft.status
                    , title: taskDraft.title
                    , purpose: taskDraft.purpose || null
                    , goal: taskDraft.goal || null
                    , instractions: taskDraft.instractions || null
                    , author: taskDraft.author || userId
                    , owner: taskDraft.owner || userId
                    , assignees: taskDraft.assignees || []
                    , members: taskDraft.members || [userId]
                    , involved: taskDraft.involved || [userId]
                    , ancestorIds: nextAncestorIds
                    , children: new Array<TaskProperties>()
                    , childrenIds: new Array<string>()
                    , startedAt: taskDraft.startedAt || null
                    , deadline: taskDraft.deadline || null
                    , templateId: taskDraft.templateId
                    , createdAt: null
                } as TaskProperties;

                // 子がある場合は先に子を処理する（IDを取得するため）
                if (taskDraft.children && taskDraft.children.length > 0) {
                    // 再帰処理
                    taskDraft.children.forEach(child => {
                        const childNode = _recursive(child, createdAt, nextAncestorIds);
                        node.children.push(childNode);
                        node.childrenIds.push(childNode.id);
                    });
                }
                
                // 最後に親を追加する
                batch.set(doc(taskCollectionRef, id), node)
                // batch.set 後に createdAt を設定する（実際の値はサーバ側で設定させるため）
                node.createdAt = createdAt;
                return node;
            };

            const task = _recursive(taskDraft);

            return batch
                .commit()
                .then(() => {
                    console.log("done", task);
                    return task;
                });
        }

        , update: (taskId: string, title: string): Promise<void> => {
            return updateDoc(
                doc(taskCollectionRef, taskId)
                , {
                    title
                    , updatedAt: serverTimestamp() //  項目を２つ更新すると、２回、nextが発火するようだ
                });
        }
    };
}
