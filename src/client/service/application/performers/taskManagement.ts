// service
import { Performer, Service, Mutable, Store } from ".";

import { Actor } from "@/shared/service/application/actors";
import { isAuthorizedUser } from "@/shared/service/application/actors/authorizedUser";
import { R, Usecase, UsecasesOf } from "@/shared/service/application/usecases";
import { ChangedTask, ItemChangeType } from "@/shared/service/domain/interfaces/backend";
import { Task, TaskProperties } from "@/shared/service/domain/taskManagement/task";
import { DrawerContentType, DrawerItem } from "../../presentation/components/drawer";


// system
import { reactive } from "vue";
import { InteractResultType } from "robustive-ts";
import { Observable, Subscription } from "rxjs";

type ImmutableTask = Readonly<TaskProperties>;
export interface TaskManagementStore extends Store {
    readonly usersTasks: ImmutableTask[];
    readonly usersProjects: ImmutableTask[];
}

export interface TaskManagementPerformer extends Performer<"taskManagement", TaskManagementStore> {
    readonly store: TaskManagementStore;
    dispatch: (usecase: UsecasesOf<"taskManagement">, actor: Actor, service: Service) => Promise<Subscription | void>;
}

export function createTaskManagementPerformer(): TaskManagementPerformer {
    const store = reactive<TaskManagementStore>({
        usersTasks: []
        , usersProjects: []
    });

    const _store = store as Mutable<TaskManagementStore>;

    const d = R.taskManagement;

    const observingUsersTasks = (usecase: Usecase<"taskManagement", "observingUsersTasks">, actor: Actor, service: Service): Promise<Subscription | void> => {
        const goals = d.observingUsersTasks.keys.goals;
        return usecase
            .interactedBy(actor)
            .then(result => {
                if (result.type !== InteractResultType.success) {
                    return console.error("TODO", result);
                }

                switch (result.lastSceneContext.scene) {
                case goals.serviceStartsObservingUsersTasks: {
                    const observable = result.lastSceneContext.observable;
                    // ログアウト時には、subscriptionを解除する
                    const subscription = observable.subscribe({
                        next: changedTasks => {
                            const mutableUsersTasks = _store.usersTasks;
                            console.log("@@@@ changedTasks", changedTasks.length);
                            changedTasks.forEach((changedTask) => {
                                switch (changedTask.case) {
                                case ItemChangeType.added: {
                                    // hot reloadで増えてしまうので、同じものを予め削除しておく
                                    for (let i = 0, imax = mutableUsersTasks.length; i < imax; i++) {
                                        if (mutableUsersTasks[i].id === changedTask.id) {
                                            mutableUsersTasks.splice(i, 0);
                                            break;
                                        }
                                    }
                                    console.log("@@@ [added]", changedTask.item);
                                    mutableUsersTasks.unshift(changedTask.item);
                                    break;
                                }
                                case ItemChangeType.modified: {
                                // doingかどうかを調べ、そうなら更新する
                                // if (self.#stores.currentUser._doingTask && self.#stores.currentUser._doingTask.id === changedTask.id) {
                                //     self.#stores.currentUser._doingTask = changedTask.item;
                                // }
                                    for (let i = 0, imax = mutableUsersTasks.length; i < imax; i++) {
                                        if (mutableUsersTasks[i].id === changedTask.id) {
                                            mutableUsersTasks.splice(i, 1, changedTask.item);
                                            console.log("@@@ [modified]", i, changedTask.item);
                                            break;
                                        }
                                    }
                                    break;
                                }
                                case ItemChangeType.removed: {
                                    for (let i = 0, imax = mutableUsersTasks.length; i < imax; i++) {
                                        if (mutableUsersTasks[i].id === changedTask.id) {
                                            mutableUsersTasks.splice(i, 0);
                                            break;
                                        }
                                    }
                                    break;
                                }
                                }
                            });
                            // ソートしておく
                            mutableUsersTasks.sort((a, b) => {
                                if (a.ancestorIds === b.ancestorIds) {
                                    return a.id.localeCompare(b.id);
                                }
                                if (a.ancestorIds === null) return -1;
                                if (b.ancestorIds === null) return 1;
                                return a.ancestorIds.localeCompare(b.ancestorIds);
                            });
                        }
                        , error: err => console.error("Observer got an error: " + err)
                    });

                    const currentActor = service.stores.shared.actor;
                    if (isAuthorizedUser(currentActor)) {
                        currentActor.addSubscription(subscription);
                    }
                }
                }
            });
    };

    const observingUsersProjects = (usecase: Usecase<"taskManagement", "observingUsersProjects">, actor: Actor, service: Service): Promise<Subscription | void> =>  {
        const goals = d.observingUsersProjects.keys.goals;

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const _projectMenu = service.stores.application.drawerItems.find((item) => item.case === DrawerContentType.group && item.title === "プロジェクト")!.children as DrawerItem[];

        return usecase
            .interactedBy(actor)
            .then(result => {
                if (result.type !== InteractResultType.success || result.lastSceneContext.scene !== goals.startObservingUsersProjects) {
                    return console.error("TODO", result);
                }
                const observable = result.lastSceneContext.observable as Observable<ChangedTask[]>; // 一度 DeepReadonly しているからか、型が壊れてしまう
                return observable
                    .subscribe({
                        next: changedTasks => {
                            const mutableUserProjects = _store.usersProjects;
                            changedTasks.forEach((changedTask) => {
                                switch (changedTask.case) {
                                case ItemChangeType.added: {
                                    // hot reloadで増えてしまうので、同じものを予め削除しておく
                                    for (let i = 0, imax = mutableUserProjects.length; i < imax; i++) {
                                        if (mutableUserProjects[i].id === changedTask.id) {
                                            mutableUserProjects.splice(i, 0);
                                            break;
                                        }
                                    }
                                    const project = changedTask.item as Task;
                                    mutableUserProjects.unshift(project);
                                    _projectMenu.unshift(DrawerItem.link({ title: project.title, href: `/projects/${ project.id }` }));
                                    break;
                                }
                                case ItemChangeType.modified: {
                                // doingかどうかを調べ、そうなら更新する
                                // if (self.#stores.currentUser._doingTask && self.#stores.currentUser._doingTask.id === changedTask.id) {
                                //     self.#stores.currentUser._doingTask = changedTask.item;
                                // }
                                    for (let i = 0, imax = mutableUserProjects.length; i < imax; i++) {
                                        if (mutableUserProjects[i].id === changedTask.id) {
                                            const project = changedTask.item as Task;
                                            mutableUserProjects.splice(i, 1, project);
                                            _projectMenu.splice(i, 1, DrawerItem.link({ title: project.title, href: `/projects/${ project.id }` }));
                                            break;
                                        }
                                    }
                                    break;
                                }
                                case ItemChangeType.removed: {
                                    for (let i = 0, imax = mutableUserProjects.length; i < imax; i++) {
                                        if (mutableUserProjects[i].id === changedTask.id) {
                                            mutableUserProjects.splice(i, 0);
                                            _projectMenu.splice(i, 0);
                                            break;
                                        }
                                    }
                                    break;
                                }
                                }
                            });
                        }
                        , error: err => console.error("Observer got an error: " + err)
                    });
            });
    };

    const updateTaskTitle = (usecase: Usecase<"taskManagement", "updateTaskTitle">, actor: Actor, service: Service): Promise<Subscription | void> =>  {
        const goals = d.updateTaskTitle.keys.goals;
        return usecase
            .interactedBy(actor)
            .then(result => {
                if (result.type !== InteractResultType.success) {
                    return console.error("TODO", result);
                }

                switch (result.lastSceneContext.scene) {
                case goals.onSuccessInUpdating: {
                    console.log("!!! onSuccessInUpdating");
                    break;
                }
                case goals.taskDoesNotExist: {
                    console.log("taskDoesNotExist", result.lastSceneContext.task);
                    break;
                }
                }
            });
    };

    const rearrangeTask = (usecase: Usecase<"taskManagement", "rearrangeTask">, actor: Actor, service: Service): Promise<Subscription | void> =>  {
        const goals = d.rearrangeTask.keys.goals;
        return usecase
            .interactedBy(actor)
            .then(result => {
                if (result.type !== InteractResultType.success) {
                    return console.error("TODO", result);
                }

                switch (result.lastSceneContext.scene) {
                case goals.onSuccessInUpdating: {
                    console.log("!!! onSuccessInUpdating");
                    break;
                }
                case goals.taskDoesNotExist: {
                    console.log("taskDoesNotExist", result.lastSceneContext.task);
                    break;
                }
                }
            });
    };

    return {
        store
        , dispatch: (usecase: UsecasesOf<"taskManagement">, actor: Actor, service: Service): Promise<Subscription | void> => {
            switch (usecase.name) {
            case "observingUsersTasks": {
                return observingUsersTasks(usecase, actor, service);
            }
            case "observingUsersProjects": {
                return observingUsersProjects(usecase, actor, service);
            }
            case "updateTaskTitle": {
                return updateTaskTitle(usecase, actor, service);
            }
            case "rearrangeTask": {
                return rearrangeTask(usecase, actor, service);
            }
            }
        }
        // TODO ここの実装から
        , observingProject: (usecase: Usecase<"taskManagement", "observingProject">, actor: Actor) : Promise<void> => {
            const goals = d.observingProject.keys.goals;
            // const _shared = service.stores.shared as Mutable<SharedStore>;
            return usecase
                .interactedBy(actor)
                .then(result => {
                    if (result.type !== InteractResultType.success) {
                        return console.error("TODO", result);
                    }
                    const context = result.lastSceneContext;
                    switch (context.scene) {
                    case goals.onSuccessThenServiceDisplaysMessages: {
                        console.log("OKKKKKK", context.messages);
                        break;
                    }
                    case goals.onFailureThenServicePresentsError: {
                        console.error(context.error);
                        break;
                    }
                    }
                });
        }
    };
}