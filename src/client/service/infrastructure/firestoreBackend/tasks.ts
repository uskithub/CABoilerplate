import { BackendErrors, ChangedTask, TaskFunctions } from "@/shared/service/domain/interfaces/backend";
import { CollectionType, autoId } from ".";
import { Log, Task, TaskDraft, TaskDraftProperties, TaskProperties, TaskStatus, TaskType } from "@/shared/service/domain/taskManagement/task";

import { collection, Firestore, onSnapshot, where, query, writeBatch, FirestoreDataConverter, DocumentData, QueryDocumentSnapshot, Timestamp, FieldValue, SnapshotOptions, DocumentReference, setDoc, doc, serverTimestamp, updateDoc, PartialWithFieldValue, getDocs, FirestoreError, orderBy, startAt, endAt, CollectionReference, collectionGroup } from "firebase/firestore";
import { Observable } from "rxjs";
import { ServiceError } from "@/shared/service/serviceErrors";
import { SystemError } from "@/shared/system/systemErrors";

type LayerStatusType = string;
interface FSTask {
    typeStatus: LayerStatusType;

    title: string;
    purpose: string | null;
    goal: string | null;
    instractions: string | null;

    author: string;
    owner?: Array<string> | undefined;
    assignees: Array<string>;
    members: Array<string>;
    involved: Array<string>;

    rearrangeRootDepth: number; // セキュリティルールで使う。Rearrange対象のタスクのRootからの深さ
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
        const item = {
            typeStatus: encodeTypeAndStatus(modelObject.type, modelObject.status)
            , title: modelObject.title
            , purpose: modelObject.purpose
            , goal: modelObject.goal
            , instractions: modelObject.instractions
            , author: modelObject.author
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

        if (modelObject.owner) {
            return { ...item, owner: modelObject.owner };
        }

        return item;
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
            , children: new Array<TaskProperties>(data.children.length)
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
    const rootTaskCollectionRef = collection(db, CollectionType.tasks).withConverter(taskConverter);
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
                        rootTaskCollectionRef
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
                    }
                    , (error: FirestoreError) => {
                        if (error.code === "permission-denied") {
                            subscriber.error(new ServiceError(BackendErrors.BKE0001, { cause: error }));
                        } else {
                            console.error(`[FirestoreError] ${ error.code }: ${ error.message }`);
                            subscriber.error(new SystemError(BackendErrors.SYSTEM, { cause: error }));
                        }
                    });
            
                unsubscribers.push(unsubscribe);
                return () => unsubscribe();
            });
        }

        , 
        /**
         *  完全な新規作成の場合:
         *    トップレベルの tasks collection にルートの taskDraft を追加し、子タスク以降は SubCollection に追加する
         *  既存タスクへのｌ子タスクとしての追加の場合:
         *    既存タスクの SubCollection に ルートのtaskDraft を追加する
         * @param taskDraft 
         * @param userId 
         */
        create: (taskDraft: TaskDraftProperties, userId: string): Promise<TaskProperties> => {
            const batch = writeBatch(db);

            /**
             * ツリー構造のタスクをバッチ処理します。
             * @returns IDやcreatedAtを設定して返します。
             */
            const _recursive = (taskDraft: TaskDraftProperties, createdAt: Date = new Date(), ancestorIds: string | null = null): TaskProperties => {
                const id = autoId();

                const node = {
                    id
                    , type: taskDraft.type
                    , status: taskDraft.status
                    , title: taskDraft.title
                    , purpose: taskDraft.purpose || null
                    , goal: taskDraft.goal || null
                    , instractions: taskDraft.instractions || null
                    , author: taskDraft.author || userId
                    , owner: taskDraft.owner
                    , assignees: taskDraft.assignees || []
                    , members: taskDraft.members || [userId]
                    , involved: taskDraft.involved || [userId]
                    , ancestorIds
                    , children: new Array<TaskProperties>()
                    , childrenIds: new Array<string>()
                    , startedAt: taskDraft.startedAt || null
                    , deadline: taskDraft.deadline || null
                    , templateId: taskDraft.templateId
                    , createdAt: null
                } as TaskProperties;

                // 子がある場合は先に子を処理する（IDを取得するため）
                if (taskDraft.children && taskDraft.children.length > 0) {
                    const nextAncestorIds = (ancestorIds || "") + id;
                    // 再帰処理
                    taskDraft.children.forEach(child => {
                        const childNode = _recursive(child, createdAt, nextAncestorIds);
                        node.children.push(childNode);
                        node.childrenIds.push(childNode.id);
                    });
                }
                
                // 最後に親を追加する
                batch.set(doc(rootTaskCollectionRef, id), node)
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
                })
                .catch(error => {
                    if (error.code === "permission-denied") {
                        return Promise.reject(new ServiceError(BackendErrors.BKE0001, { cause: error }));
                    } else {
                        console.error(`[FirestoreError] ${ error.code }: ${ error.message }`);
                        return Promise.reject(new ServiceError(BackendErrors.SYSTEM, { cause: error }));
                    }
                });
        }

        , update: (task: TaskProperties, title: string): Promise<void> => {
            return updateDoc(
                doc(rootTaskCollectionRef, task.id)
                , {
                    title
                    , updatedAt: serverTimestamp() //  項目を２つ更新すると、２回、nextが発火するようだ
                });
        }
        , 
        /**
         * 1. removing or modifying from current parent
         * 2. adding to new parent
         * 3. modifying target's ancestorIds
         * 4. modifying target's descendants' ancestorIds
         * 
         * rearrangeでtaskを再配置する際に、一緒に移動される子孫タスクの中には、ユーザが与り知らないものも含まれる。
         * これらも一緒に移動できるようにする方法を考える。
         * 
         * ① 子孫タスクは、親タスクのinvolvedを必ず包含するようにする
         *    → 再配置時には、task.involved = newParent.involved + task(author + owner+ assignees + members)
         *      task.child.involved = task.involved + child(author + owner+ assignees + members) と更新する？？
         *    → 非現実的
         * 
         * ② taskをpublic/privateの項目に分け、ancensorIdsはpublicとする。
         * 
         * 
         * @param taskId 
         * @param currentParent 
         * @param newParent
         * @param index
         */
        rearrange: (task: TaskProperties, currentParent: TaskProperties, newParent: TaskProperties, index: number): Promise<void> => {
            const batch = writeBatch(db);
            // Without converter. Because 'children' in firestore is string[], not TaskProperty[].
            const taskCollectionRefForUpdateChildren = collection(db, CollectionType.tasks);
            
            console.log("### current parent task id:", currentParent.id);
            console.log("### new parent task id:", newParent.id);
            console.log("### target task id:", task.id);

            /* 1. removing or modifying from current parent */
            const exParentNewChildren = currentParent.childrenIds.filter(id => id !== task.id);
            if (currentParent.id !== newParent.id) {
                batch.update(doc(taskCollectionRefForUpdateChildren, currentParent.id), { children: exParentNewChildren });
            } else {
                exParentNewChildren.splice(index, 0, task.id);
                batch.update(doc(taskCollectionRefForUpdateChildren, currentParent.id), { children: exParentNewChildren });
                // END (skip 2,3)
                return batch.commit()
                    .catch(error => {
                        return Promise.reject(new ServiceError(BackendErrors.BKE0002, { cause: error }));
                    });                
            }

            /* 2. adding to new parent */
            const newParentNewChildren = newParent.childrenIds.concat(); // copy
            newParentNewChildren.splice(index, 0, task.id);

            batch.update(doc(taskCollectionRefForUpdateChildren, newParent.id), { children: newParentNewChildren });

            /* 3. modifying target's ancestorIds */
            const newAncestorIds = `${ newParent.ancestorIds || "" }${ newParent.id }`;
            batch.update(doc(taskCollectionRefForUpdateChildren, task.id), { ancestorIds: newAncestorIds });

            if (task.childrenIds.length === 0) {
                // END (skip 4)
                return batch.commit()
                    .catch((error: FirestoreError) => {
                        return Promise.reject(new ServiceError(BackendErrors.BKE0002, { cause: error }));
                    });
            }

            /* 4. modifying target's descendants' ancestorIds */
            const targetAncestorIds = `${ task.ancestorIds || "" }${ task.id }`;
            const depth = targetAncestorIds.length / 20;
            
            return getDocs(
                query(
                    rootTaskCollectionRef
                    // , where("involved", "array-contains", userId) <--- 現状のtaskとruleでは、これをやらないとpermission-deniedになる
                    // ancestorIds が targetAncestorIds で始まるものを取得
                    , orderBy("ancestorIds")
                    , startAt(targetAncestorIds)
                    , endAt(`${ targetAncestorIds }z`) // "1" < "Z" < "z"
                )
            ).then(querySnapshot => {
                querySnapshot.forEach(snapshot => {
                    const descendant = snapshot.data();
                    console.log(">>> descendant:", snapshot.id);
                    if (descendant.ancestorIds === null) return;
                    const descendantNewAncestorIds = descendant.ancestorIds.replace(targetAncestorIds, `${ newAncestorIds }${ task.id }`);
                    batch.update(doc(taskCollectionRefForUpdateChildren, snapshot.id), {
                        rearrangeRootDepth: depth
                        , ancestorIds: descendantNewAncestorIds 
                    });
                });
                return batch.commit()
                    .catch((error: FirestoreError) => {
                        if (error.code === "permission-denied") {
                            Promise.reject(new ServiceError(BackendErrors.BKE0001, { cause: error }));
                        } else {
                            console.error(`[FirestoreError] ${ error.code }: ${ error.message }`);
                            Promise.reject(new ServiceError(BackendErrors.SYSTEM, { cause: error }));
                        }
                    });
            })
            .catch((error: FirestoreError) => {
                if (error.code === "permission-denied") {
                    Promise.reject(new ServiceError(BackendErrors.BKE0001, { cause: error }));
                } else {
                    console.error(`[FirestoreError] ${ error.code }: ${ error.message }`);
                    Promise.reject(new ServiceError(BackendErrors.SYSTEM, { cause: error }));
                }
            });
        }
    };
}
