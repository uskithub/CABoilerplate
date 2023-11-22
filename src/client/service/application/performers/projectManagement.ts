// service

// system
import { Dictionary, DICTIONARY_KEY } from "@/shared/system/localizations";
import { inject, reactive } from "vue";
import { Performer, Dispatcher, Mutable, SharedStore, Store } from ".";
import { useRouter } from "vue-router";
import { Subscription } from "rxjs";
import { Actor } from "@/shared/service/application/actors";
import { MessageProperties } from "@/shared/service/domain/chat/message";
import { SignedInUser } from "@/shared/service/application/actors/signedInUser";
import { Usecase, UsecasesOf } from "@/shared/service/application/usecases";
import { InteractResultType } from "robustive-ts";

export interface ProjectManagementStore extends Store {
    dummy: string
}

export interface ProjectManagementPerformer extends Performer<"projectManagement", ProjectManagementStore> {
    readonly store: ProjectManagementStore;
    dispatch: (usecase: UsecasesOf<"projectManagement">, actor: Actor) => Promise<Subscription | void>;
}

export function createProjectManagementPerformer(): ProjectManagementPerformer {
    const store = reactive<ProjectManagementStore>({
        dummy: ""
    });

    const observingUsersTasks = (usecase: Usecase<"projectManagement", "observingUsersTasks">, actor: Actor): Promise<Subscription | void> => {
        const goals = Service.usecases.observingUsersTasks.goals;
        return usecase
            .interactedBy(actor)
            .then(result => {
                if (result.type !== InteractResultType.success || result.lastSceneContext.scene !== goals.serviceStartsObservingUsersTasks) {
                    return;
                }
                console.log("Started observing user's tasks...");
                return result.lastSceneContext.observable
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
                                    mutableUserTasks.unshift(changedTask.item);
                                    break;
                                }
                                case ItemChangeType.modified: {
                                // doingかどうかを調べ、そうなら更新する
                                // if (self.#stores.currentUser._doingTask && self.#stores.currentUser._doingTask.id === changedTask.id) {
                                //     self.#stores.currentUser._doingTask = changedTask.item;
                                // }
                                    for (let i = 0, imax = mutableUserTasks.length; i < imax; i++) {
                                        if (mutableUserTasks[i].id === changedTask.id) {
                                            mutableUserTasks.splice(i, 1, changedTask.item);
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

    const observingUsersProjects = (usecase: Usecase<"projectManagement", "observingUsersProjects">, actor: Actor): Promise<Subscription | null> =>  {
        const goals = Service.usecases.observingUsersProjects.goals;
        return usecase
            .interactedBy(actor)
            .then(result => {
                if (result.type !== InteractResultType.success || result.lastSceneContext.scene !== goals.serviceDoNothing) {
                    return;
                }
                return result.lastSceneContext.observable
                    .subscribe({
                        next: ([lastSceneContext]) => {
                            switch (lastSceneContext.scene) {
                            case goals.serviceDoNothing: {
                                console.log("Started observing user's tasks...");
                                break;
                            }
                            case goals.onUpdateUsersProjectsThenServiceUpdateUsersProjectList: {
                                const mutableUserProjects = _store.userProjects;
                            
                            
                                lastSceneContext.changedTasks.forEach((changedTask) => {
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
                            }
                        }
                    });
            });
    };

    return {
        store
        , dispatch: (usecase: UsecasesOf<"projectManagement">, actor: Actor): Promise<Subscription | void> => {
            switch (usecase.name) {
            case "observingUsersTasks": {
                return observingUsersTasks(usecase, actor);
            }
            case "observingUsersProjects": {
                return observingUsersProjects(usecase, actor);
            }
            }
        }
        // TODO ここの実装から
        , observingProject: (usecase: Usecase<"projectManagement", "observingProject">, actor: Actor) : Promise<void> => {
            const goals = SignedInUser.usecases.observingProject.goals;
            // const _shared = dispatcher.stores.shared as Mutable<SharedStore>;
            return usecase
                .interactedBy(actor)
                .then(result => {
                    if (result.type !== InteractResultType.success) { return; }
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