// service

// system
import { reactive } from "vue";
import { Performer, Dispatcher, Mutable, SharedStore, Store } from ".";
import { useRouter } from "vue-router";
import { Observable, Subscription } from "rxjs";
import { Actor } from "@/shared/service/application/actors";
import { MessageProperties } from "@/shared/service/domain/chat/message";
import { AuthorizedUser } from "@/shared/service/application/actors/authorizedUser";
import { R, Usecase, UsecasesOf } from "@/shared/service/application/usecases";
import { InteractResultType } from "robustive-ts";
import { Service } from "@/shared/service/application/actors/service";
import { ChangedTask, ItemChangeType } from "@/shared/service/domain/interfaces/backend";
import { Task } from "@/shared/service/domain/projectManagement/task";
import { DrawerContentType, DrawerItem } from "../../presentation/components/drawer";

type ImmutableTask = Readonly<Task>;
export interface ProjectManagementStore extends Store {
    readonly userTasks: ImmutableTask[];
    readonly userProjects: ImmutableTask[];
}

export interface ProjectManagementPerformer extends Performer<"projectManagement", ProjectManagementStore> {
    readonly store: ProjectManagementStore;
    dispatch: (usecase: UsecasesOf<"projectManagement">, actor: Actor, dispatcher: Dispatcher) => Promise<Subscription | void>;
}

export function createProjectManagementPerformer(): ProjectManagementPerformer {
    const store = reactive<ProjectManagementStore>({
        userTasks: []
        , userProjects: []
    });

    const _store = store as Mutable<ProjectManagementStore>;

    const d = R.projectManagement;

    const observingUsersTasks = (usecase: Usecase<"projectManagement", "observingUsersTasks">, actor: Actor, dispatcher: Dispatcher): Promise<Subscription | void> => {
        const goals = d.observingUsersTasks.keys.goals;
        return usecase
            .interactedBy(actor)
            .then(result => {
                if (result.type !== InteractResultType.success || result.lastSceneContext.scene !== goals.serviceStartsObservingUsersTasks) {
                    return console.error("TODO", result);
                }
                console.log("Started observing user's tasks...");
                const observable = result.lastSceneContext.observable as unknown as Observable<ChangedTask[]>; // 一度 DeepReadonly しているからか、型が壊れてしまう
                return observable
                    .subscribe({
                        next: changedTasks => {
                            const mutableUserTasks = _store.userTasks;
                            changedTasks.forEach((changedTask) => {
                                switch (changedTask.case) {
                                case ItemChangeType.added: {
                                    // hot reloadで増えてしまうので、同じものを予め削除しておく
                                    for (let i = 0, imax = mutableUserTasks.length; i < imax; i++) {
                                        if (mutableUserTasks[i].id === changedTask.id) {
                                            mutableUserTasks.splice(i, 0);
                                            break;
                                        }
                                    }
                                    mutableUserTasks.unshift(changedTask.item as Task);
                                    break;
                                }
                                case ItemChangeType.modified: {
                                // doingかどうかを調べ、そうなら更新する
                                // if (self.#stores.currentUser._doingTask && self.#stores.currentUser._doingTask.id === changedTask.id) {
                                //     self.#stores.currentUser._doingTask = changedTask.item;
                                // }
                                    for (let i = 0, imax = mutableUserTasks.length; i < imax; i++) {
                                        if (mutableUserTasks[i].id === changedTask.id) {
                                            mutableUserTasks.splice(i, 1, changedTask.item as Task);
                                            break;
                                        }
                                    }
                                    break;
                                }
                                case ItemChangeType.removed: {
                                    for (let i = 0, imax = mutableUserTasks.length; i < imax; i++) {
                                        if (mutableUserTasks[i].id === changedTask.id) {
                                            mutableUserTasks.splice(i, 0);
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

    const observingUsersProjects = (usecase: Usecase<"projectManagement", "observingUsersProjects">, actor: Actor, dispatcher: Dispatcher): Promise<Subscription | void> =>  {
        const goals = d.observingUsersProjects.keys.goals;

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const _projectMenu = dispatcher.stores.application.drawerItems.find((item) => item.case === DrawerContentType.group && item.title === "プロジェクト")!.children as DrawerItem[];

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
                            const mutableUserProjects = _store.userProjects;
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

    return {
        store
        , dispatch: (usecase: UsecasesOf<"projectManagement">, actor: Actor, dispatcher: Dispatcher): Promise<Subscription | void> => {
            switch (usecase.name) {
            case "observingUsersTasks": {
                return observingUsersTasks(usecase, actor, dispatcher);
            }
            case "observingUsersProjects": {
                return observingUsersProjects(usecase, actor, dispatcher);
            }
            }
        }
        // TODO ここの実装から
        , observingProject: (usecase: Usecase<"projectManagement", "observingProject">, actor: Actor) : Promise<void> => {
            const goals = d.observingProject.keys.goals;
            // const _shared = dispatcher.stores.shared as Mutable<SharedStore>;
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