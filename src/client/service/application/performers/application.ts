// service

// system
import { reactive } from "vue";
import { Performer, Mutable, SharedStore, Store, Dispatcher } from ".";
import { Subscription } from "rxjs";
import { SignInStatuses } from "@/shared/service/domain/interfaces/authenticator";
import { SignedInUser } from "@/shared/service/application/actors/signedInUser";
import { Actor } from "@/shared/service/application/actors";
import { Nobody } from "@/shared/service/application/actors/nobody";
import { U, Usecase, UsecasesOf } from "@/shared/service/application/usecases";
import { Task } from "@/shared/service/domain/entities/task";
import { DrawerContentType, DrawerItem } from "../../presentation/components/drawer";
import { InteractResultType } from "robustive-ts";

type ImmutableDrawerItems = Readonly<DrawerItem>;

export interface ApplicationStore extends Store {
    readonly drawerItems: ImmutableDrawerItems[];
}

export interface ApplicationPerformer extends Performer<"application", ApplicationStore> {
    readonly store: ApplicationStore;
    dispatch: (usecase: UsecasesOf<"application">, actor: Actor, dispatcher: Dispatcher) => Promise<Subscription | void>;
}

export function createApplicationPerformer(): ApplicationPerformer {

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
    });

    const _store = store as Mutable<ApplicationStore>;
    
    const boot = (usecase: Usecase<"application", "boot">, actor: Actor, dispatcher: Dispatcher): Promise<void> => {
        const goals = Nobody.usecases.boot.goals;
        const _shared = dispatcher.stores.shared as Mutable<SharedStore>;
        return usecase
            .interactedBy(actor)
            .then((result) => {
                if (result.type === InteractResultType.success) {
                    switch (result.lastSceneContext.scene) {
                    case goals.userDataExistsThenServicePresentsHomeView: {
                        const user = { ...result.lastSceneContext.user };
                        const actor = new SignedInUser(user);
                        dispatcher.change(actor);
                        _shared.signInStatus = SignInStatuses.signIn({ account: user });
                        _shared.isLoading = false;
                        break;
                    }
                    case goals.sessionNotExistsThenServicePresentsSignInView: {
                        _shared.signInStatus = SignInStatuses.signOut();
                        dispatcher.routingTo("/signin");
                        break;
                    }
                    case goals.userDataNotExistsThenServicePerformsSignUpWithGoogleOAuth: {
                        _shared.signInStatus = SignInStatuses.signOut();
                        return dispatcher.dispatch(U.authentication.signUp.basics[Nobody.usecases.signUp.basics.onSuccessPublishNewAccountThenServiceCreateUserData]({ account: result.lastSceneContext.account }), actor)
                            .then(() => { return; });
                    }
                    }
                }
            });
    };
    
    return {
        store
        , dispatch: (usecase: UsecasesOf<"application">, actor: Actor, dispatcher: Dispatcher): Promise<Subscription | void> => {
            switch (usecase.name) {
            case "boot": {
                return boot(usecase, actor, dispatcher);
            }
            }
        }
    };
}