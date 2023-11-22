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
import { Usecase, UsecasesOf } from "@/shared/service/application/usecases";
import { Task } from "@/shared/service/domain/entities/task";
import { ItemChangeType } from "@/shared/service/domain/interfaces/backend";
import { DrawerContentType, DrawerItem } from "../../presentation/components/drawer";
import { InteractResultType } from "robustive-ts";

type ImmutableTask = Readonly<Task>;
type ImmutableDrawerItems = Readonly<DrawerItem>;

export interface ApplicationStore extends Store {
    readonly drawerItems: ImmutableDrawerItems[];
    readonly userTasks: ImmutableTask[];
    readonly userProjects: ImmutableTask[];
}

export interface ApplicationPerformer extends Performer<"application", ApplicationStore> {
    readonly store: ApplicationStore;
    dispatch: (usecase: UsecasesOf<"application">, actor: Actor) => Promise<Subscription | void>;
}

export function createApplicationPerformer(): ApplicationPerformer {
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

    const boot = (usecase: Usecase<"application", "boot">, actor: Actor): Promise<void> => {
        const goals = Nobody.usecases.boot.goals;
        const _shared = dispatcher.stores.shared as Mutable<SharedStore>;
        return usecase
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
            });
    };
    
    return {
        store
        , dispatch: (usecase: UsecasesOf<"application">, actor: Actor): Promise<Subscription | void> => {
            switch (usecase.name) {
            case "boot": {
                return boot(usecase, actor);
            }
            }
        }
    };
}