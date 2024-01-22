// service

// system
import { reactive } from "vue";
import { Performer, Mutable, SharedStore, Store, Dispatcher } from ".";
import { Observable, Subscription } from "rxjs";
import { SignInStatuses } from "@/shared/service/domain/interfaces/authenticator";
import { AuthorizedUser } from "@/shared/service/application/actors/authorizedUser";
import { Actor } from "@/shared/service/application/actors";
import { R, Usecase, UsecasesOf } from "@/shared/service/application/usecases";
import { Task } from "@/shared/service/domain/projectManagement/task";
import { DrawerContentType, DrawerItem } from "../../presentation/components/drawer";
import { InteractResultType } from "robustive-ts";
import { UserProperties } from "@/shared/service/domain/authentication/user";
import { AuthenticatedUser } from "@/shared/service/application/actors/authenticatedUser";
import { dictionary as t } from "@/client/main";

type ImmutableDrawerItems = Readonly<DrawerItem>;

export interface ApplicationStore extends Store {
    readonly drawerItems: ImmutableDrawerItems[];
    readonly userDataSubscription: Subscription | null;
}

export interface ApplicationPerformer extends Performer<"application", ApplicationStore> {
    readonly store: ApplicationStore;
    dispatch: (usecase: UsecasesOf<"application">, actor: Actor, dispatcher: Dispatcher) => Promise<Subscription | void>;
}

export function createApplicationPerformer(): ApplicationPerformer {

    const store = reactive<ApplicationStore>({
        drawerItems : [
            DrawerItem.header({ title: "Menu1" })
            , DrawerItem.link({ title: t.timeline.views.title, href: "/" })
            , DrawerItem.link({ title: "保証一覧", href: "/warranties" })
    
            , DrawerItem.divider()
            , DrawerItem.header({ title: "Menu2" })
            , DrawerItem.link({ title: "タスク一覧", href: "/tasks" })
            , DrawerItem.group({ title: "プロジェクト", children: Array<DrawerItem>() })
            // , DrawerItem.link({ title: "link3", href: "/link3" })
        ]
        , userDataSubscription: null
    });

    const _store = store as Mutable<ApplicationStore>;

    const d = R.application;
    
    const boot = (usecase: Usecase<"application", "boot">, actor: Actor, dispatcher: Dispatcher): Promise<void> => {
        const goals = d.boot.keys.goals;
        const _shared = dispatcher.stores.shared as Mutable<SharedStore>;
        return usecase
            .interactedBy(actor)
            .then(result => {
                if (result.type !== InteractResultType.success) {
                    return console.error("TODO", result);
                }

                switch (result.lastSceneContext.scene) {
                case goals.servicePresentsHomeView: {
                    const observable = result.lastSceneContext.userDataObservable as unknown as Observable<UserProperties | null>;
                    const account = result.lastSceneContext.account;
                    let isAlreadyDispatched = false;
                    // ログアウトしてもそのままで、購読解除することはない
                    const subscription = observable.subscribe({
                        next: (userProperties) => {
                            if (userProperties === null) {
                                const actor = new AuthenticatedUser(account);
                                dispatcher.change(actor);
                                _shared.signInStatus = SignInStatuses.signingIn({ account });
                                if (!isAlreadyDispatched) { // ログイン中のPCがある場合、ユーザ情報を削除したことをトリガーにこの動作が発生してしまうので、一度だけ実行するようにする
                                    dispatcher.dispatch(R.authentication.signUp.basics.onSuccessInPublishingNewAccountThenServiceGetsOrganizationOfDomain({ account }), actor)
                                        .catch(error => console.error(error));
                                    isAlreadyDispatched = true;
                                }
                            } else {
                                const actor = new AuthorizedUser(userProperties);
                                dispatcher.change(actor);
                                _shared.signInStatus = SignInStatuses.signIn({ userProperties });
                                _shared.isLoading = false;
                                dispatcher.routingTo("/");
                            }
                        }
                        , error: (e) => console.error(e)
                        , complete: () => {
                            console.info("complete");
                            subscription?.unsubscribe();
                        }
                    });
                    _store.userDataSubscription = subscription;
                    break;
                }
                case goals.sessionNotExistsThenServicePresentsSignInView: {
                    _shared.signInStatus = SignInStatuses.signOut();
                    dispatcher.routingTo("/signin");
                    break;
                }
                // case goals.userDataNotExistsThenServicePerformsSignUpWithGoogleOAuth: {
                //     _shared.signInStatus = SignInStatuses.signOut();
                //     return dispatcher.dispatch(R.authentication.signUp.basics[Nobody.usecases.signUp.basics.onSuccessInPublishingNewAccountThenServiceCreateUserData]({ account: result.lastSceneContext.account }), actor)
                //         .then(() => { return; });
                // }
                }
            });
    };
    
    return {
        store
        , dispatch: (usecase: UsecasesOf<"application">, actor: Actor, dispatcher: Dispatcher): Promise<Subscription | void> => {
            switch (usecase.name) {
            case d.keys.boot: {
                return boot(usecase, actor, dispatcher);
            }
            }
        }
    };
}