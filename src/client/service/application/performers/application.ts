// service

// system
import { reactive } from "vue";
import { Performer, Mutable, SharedStore, Store, Service } from ".";
import { Observable, Subscription } from "rxjs";
import { SignInStatuses } from "@/shared/service/domain/interfaces/authenticator";
import { AuthorizedUser } from "@/shared/service/application/actors/authorizedUser";
import { Actor } from "@/shared/service/application/actors";
import { R, Usecase, UsecasesOf } from "@/shared/service/application/usecases";
import { Task } from "@/shared/service/domain/projectManagement/task";
import { DrawerContentType, DrawerItem } from "../../presentation/components/drawer";
import { InteractResultType } from "robustive-ts";
import { Account, UserProperties } from "@/shared/service/domain/authentication/user";
import { AuthenticatedUser } from "@/shared/service/application/actors/authenticatedUser";
import { dictionary as t } from "@/client/main";

type ImmutableDrawerItems = Readonly<DrawerItem>;

export interface ApplicationStore extends Store {
    readonly drawerItems: ImmutableDrawerItems[];
    readonly userDataSubscription: Subscription | null;
}

export interface ApplicationPerformer extends Performer<"application", ApplicationStore> {
    readonly store: ApplicationStore;
    dispatch: (usecase: UsecasesOf<"application">, actor: Actor, service: Service) => Promise<Subscription | void>;
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
    
    const boot = (usecase: Usecase<"application", "boot">, actor: Actor, service: Service): Promise<void> => {
        const goals = d.boot.keys.goals;
        const _shared = service.stores.shared as Mutable<SharedStore>;
        return usecase
            .interactedBy(actor)
            .then(result => {
                if (result.type !== InteractResultType.success) {
                    return console.error("TODO", result);
                }

                switch (result.lastSceneContext.scene) {
                case goals.servicePresentsHomeView: {
                    const userDataObservable = result.lastSceneContext.userDataObservable as unknown as Observable<UserProperties | null>;
                    const account = result.lastSceneContext.account;

                    service.change(SignInStatuses.signingIn({ account }));
                    service.dispatch(R.application.observingUserData.goals.servieStartsObserving({ account, userDataObservable }), service.serviceActor)
                    break;
                }
                case goals.sessionNotExistsThenServicePresentsSignInView: {
                    _shared.signInStatus = SignInStatuses.signOut();
                    service.routingTo("/signin");
                    break;
                }
                }
            });
    };

    const observingUserData = (usecase: Usecase<"application", "observingUserData">, actor: Actor, service: Service): Promise<void> => {
        const goals = d.observingUserData.keys.goals;
        const _shared = service.stores.shared as Mutable<SharedStore>;
        return usecase
            .interactedBy(actor)
            .then(result => {
                if (result.type !== InteractResultType.success) {
                    return console.error("TODO", result);
                }

                switch (result.lastSceneContext.scene) {
                case goals.servieStartsObserving: {
                    const observable = result.lastSceneContext.userDataObservable as unknown as Observable<UserProperties | null>;
                    const account = result.lastSceneContext.account as unknown as Account;
                    let isFirstTime = true;
                    // ログアウトしてもそのままで、購読解除することはない
                    const subscription = observable.subscribe({
                        next: (userProperties) => {
                            if (userProperties === null) { 
                                if (isFirstTime) { // ログイン中のPCがある場合、ユーザ情報を削除したことをトリガーにこの動作が発生してしまうので、一度だけ実行するようにする
                                    isFirstTime = false;
                                    service.dispatch(R.application.observingUserData.alternatives.serviceGetsNullData({ account }), service.serviceActor)
                                        .catch(error => console.error(error));
                                }
                            } else {
                                if (isFirstTime) {
                                    isFirstTime = false;
                                    service.change(SignInStatuses.signIn({ userProperties }));
                                    service.dispatch(R.application.observingUserData.alternatives.serviceGetsDataForTheFirstTime({ user: userProperties }), service.serviceActor)
                                        .catch(error => console.error(error));
                                } else {
                                    service.dispatch(R.application.observingUserData.basics.serviceObservedUpdate({ user: userProperties }), service.serviceActor)
                                        .catch(error => console.error(error));
                                }
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
                case goals.serviceUpdatesUserData: {
                    const userProperties = result.lastSceneContext.user as unknown as UserProperties;
                    service.change(SignInStatuses.signIn({ userProperties }));
                    break;
                }
                case goals.servicePerformsObservingUsersTasksUsecase: {
                    _shared.isLoading = false;
                    service.routingTo("/");
                    // TODO: dispatch observing tasks
                    break;
                }
                case goals.servicePerformsSigningUpWithGoogleOAuthUsecase: {
                    const account = result.lastSceneContext.account as unknown as Account;
                    service.dispatch(R.authentication.signUp.alternatives.serviceGetsOrganizationOfDomain({ account }), actor)
                        .then(() => { return; });
                }
                }
            });
    }
    
    return {
        store
        , dispatch: (usecase: UsecasesOf<"application">, actor: Actor, service: Service): Promise<Subscription | void> => {
            switch (usecase.name) {
            case d.keys.boot: {
                return boot(usecase, actor, service);
            }
            case d.keys.observingUserData: {
                return observingUserData(usecase, actor, service);
            }
            }
        }
    };
}