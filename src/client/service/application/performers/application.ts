// service

// system
import { Dictionary, DICTIONARY_KEY } from "@/shared/system/localizations";
import { inject, reactive } from "vue";
import { Performer, Dispatcher, Mutable, SharedStore, Store } from ".";
import { useRouter } from "vue-router";
import { Subscription } from "rxjs";
import { SignInStatuses } from "@/shared/service/domain/interfaces/authenticator";
import { SignedInUser } from "@/shared/service/application/actors/signedInUser";
import { Actor } from "@/shared/service/application/actors";
import { Nobody } from "@/shared/service/application/usecases/nobody";
import { Service } from "@/shared/service/application/usecases/service";
import { Usecase } from "@/shared/service/application/usecases";
import { Task } from "@/shared/service/domain/entities/task";
import { ItemChangeType } from "@/shared/service/domain/interfaces/backend";

type ImmutableTask = Readonly<Task>;

export interface ApplicationStore extends Store {
    readonly userTasks: ImmutableTask[];
    readonly userProjects: ImmutableTask[];
}

export interface ApplicationPerformer extends Performer<ApplicationStore> {
    readonly store: ApplicationStore;
    boot: (usecase: Usecase<"boot">, actor: Actor) => void;
    observingUsersTasks: (usecase: Usecase<"observingUsersTasks">, actor: Actor) => Subscription;
    observingUsersProjects: (usecase: Usecase<"observingUsersProjects">, actor: Actor) => Subscription;
}

export function createApplicationPerformer(dispatcher: Dispatcher): ApplicationPerformer {
    const t = inject(DICTIONARY_KEY) as Dictionary;
    const router = useRouter();

    const store = reactive<ApplicationStore>({
        userTasks: []
        , userProjects: []
    });

    const _store = store as Mutable<ApplicationStore>;

    return {
        store
        , boot: (usecase: Usecase<"boot">, actor: Actor) => {
            const goals = Nobody.boot.goals;
            const _shared = dispatcher.stores.shared as Mutable<SharedStore>;
            let subscription: Subscription | null = null;
            subscription = usecase
                .interactedBy(actor, {
                    next: ([lastSceneContext]) => {
                        switch (lastSceneContext.scene) {
                        case goals.sessionExistsThenServicePresentsHome: {
                            const user = { ...lastSceneContext.user };
                            const actor = new SignedInUser(user);
                            dispatcher.change(actor);
                            _shared.signInStatus = SignInStatuses.signIn({ user });
                            break;
                        }
                        case goals.sessionNotExistsThenServicePresentsSignin: {
                            _shared.signInStatus = SignInStatuses.signOut();
                            router.replace("/signin")
                                .catch((error: Error) => {
                                });
                            break;
                        }
                        }
                    }
                    , complete: () => dispatcher.commonCompletionProcess(subscription)
                });
        }
        , observingUsersTasks: (usecase: Usecase<"observingUsersTasks">, actor: Actor): Subscription =>  {
            const goals = Service.observingUsersTasks.goals;
            const _shared = dispatcher.stores.shared as Mutable<SharedStore>;
            let subscription: Subscription | null = null;
            subscription = usecase
                .interactedBy(actor, {
                    next: ([lastSceneContext]) => {
                        switch (lastSceneContext.scene) {
                        case goals.serviceDoNothing: {
                            console.log("Started observing user's tasks...");
                            break;
                        }
                        case goals.onUpdateUsersTasksThenServiceUpdateUsersTaskList: {
                            const mutableUserTasks = _store.userTasks ;
                            lastSceneContext.changedTasks.forEach((changedTask) => {
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
                        }
                    }
                });
            return subscription;
        }
        , observingUsersProjects: (usecase: Usecase<"observingUsersProjects">, actor: Actor): Subscription =>  {
            const goals = Service.observingUsersProjects.goals;
            const _shared = dispatcher.stores.shared as Mutable<SharedStore>;
            let subscription: Subscription | null = null;
            subscription = usecase
                .interactedBy(actor, {
                    next: ([lastSceneContext]) => {
                        switch (lastSceneContext.scene) {
                        case goals.serviceDoNothing: {
                            console.log("Started observing user's tasks...");
                            break;
                        }
                        case goals.onUpdateUsersProjectsThenServiceUpdateUsersProjectList: {
                            const mutableUserProjects = _store.userProjects ;
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
                                    mutableUserProjects.unshift(changedTask.item);
                                    break;
                                }
                                case ItemChangeType.modified: {
                                    // doingかどうかを調べ、そうなら更新する
                                    // if (self.#stores.currentUser._doingTask && self.#stores.currentUser._doingTask.id === changedTask.id) {
                                    //     self.#stores.currentUser._doingTask = changedTask.item;
                                    // }
                                    for (let i = 0, imax = mutableUserProjects.length; i < imax; i++) {
                                        if (mutableUserProjects[i].id === changedTask.id) {
                                            mutableUserProjects.splice(i, 1, changedTask.item);
                                            break;
                                        }
                                    }
                                    break;
                                }
                                case ItemChangeType.removed: {
                                    for (let i = 0, imax = mutableUserProjects.length; i < imax; i++) {
                                        if (mutableUserProjects[i].id === changedTask.id) {
                                            mutableUserProjects.splice(i, 0);
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
            return subscription;
        }
    };
}