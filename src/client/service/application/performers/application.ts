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
import { Nobody } from "@/shared/service/application/actors/nobody";
import { Service } from "@/shared/service/application/actors/service";
import { Usecase } from "@/shared/service/application/usecases";
import { Task } from "@/shared/service/domain/entities/task";
import { ItemChangeType } from "@/shared/service/domain/interfaces/backend";
import { DrawerContentType, DrawerItem } from "../../presentation/components/drawer";
import { InteractResultType } from "robustive-ts/types/usecase";

type ImmutableTask = Readonly<Task>;
type ImmutableDrawerItems = Readonly<DrawerItem>;

export interface ApplicationStore extends Store {
    readonly drawerItems: ImmutableDrawerItems[];
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
        drawerItems : [
            DrawerItem.header({ title: "Menu1" })
            , DrawerItem.link({ title: "保証一覧", href: "/warranties" })
            , DrawerItem.link({ title: "保険加入アイテム", href: "/insuranceItems" })
            , DrawerItem.divider()
            , DrawerItem.header({ title: "Menu2" })
            , DrawerItem.link({ title: "Chat", href: "/" })
            , DrawerItem.link({ title: "タスク一覧", href: "/tasks" })
            , DrawerItem.group({ title: "プロジェクト", children: Array<DrawerItem>() })
            // , DrawerItem.link({ title: "link3", href: "/link3" })
        ]
        , userTasks: []
        , userProjects: []
    });

    const _store = store as Mutable<ApplicationStore>;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const _projectMenu = _store.drawerItems.find((item) => item.case === DrawerContentType.group && item.title === "プロジェクト")!.children as DrawerItem[];

    return {
        store
        , boot: (usecase: Usecase<"boot">, actor: Actor) => {
            const goals = Nobody.usecases.boot.goals;
            const _shared = dispatcher.stores.shared as Mutable<SharedStore>;
            usecase
                .interactedBy(actor)
                .then((result) => {
                    if (result.type === InteractResultType.success) {
                        switch (result.lastSceneContext.scene) {
                        case goals.sessionExistsThenServicePresentsHome: {
                            const user = { ...result.lastSceneContext.user };
                            const actor = new SignedInUser(user);
                            dispatcher.change(actor);
                            _shared.signInStatus = SignInStatuses.signIn({ user });
                            break;
                        }
                        case goals.sessionNotExistsThenServicePresentsSignin: {
                            _shared.signInStatus = SignInStatuses.signOut();
                            router.replace("/signin")
                                .catch((error: Error) => {});
                            break;
                        }
                        }
                    }
                })
                .catch(err => console.error(err));
        }
        , observingUsersTasks: (usecase: Usecase<"observingUsersTasks">, actor: Actor): Subscription =>  {
            const goals = Service.usecases.observingUsersTasks.goals;
            const _shared = dispatcher.stores.shared as Mutable<SharedStore>;
            usecase
                .interactedBy(actor)
                .then((result) => {
                    if (result.type === InteractResultType.success && result.lastSceneContext.scene === goals.serviceStartsObservingUsersTasks) {
                        console.log("Started observing user's tasks...");
                        return result.lastSceneContext.observable;
                    }
                })
                .then((observable) => {
                    const subscription = observable.subscribe({
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
                })
                .catch(err => console.error(err));
        }
        , observingUsersProjects: (usecase: Usecase<"observingUsersProjects">, actor: Actor): Subscription =>  {
            const goals = Service.usecases.observingUsersProjects.goals;
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
            return subscription;
        }
    };
}