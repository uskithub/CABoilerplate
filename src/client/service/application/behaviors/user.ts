// service
import { isSignInGoal, isSignInScene, SignIn, SignInScenes, SignInUsecase } from "@/shared/service/application/usecases/nobody/signIn";
import { isSignOutGoal, SignOut, SignOutScenes, SignOutUsecase } from "@/shared/service/application/usecases/signedInUser/signOut";
import { SignedInUser } from "@/shared/service/application/actors/signedInUser";

// system
import { Dictionary, DICTIONARY_KEY } from "@/shared/system/localizations";
import { inject, reactive } from "vue";
import { Behavior, Store, Mutable, SharedStore, BehaviorController } from ".";
import { useRouter } from "vue-router";
import { Subscription } from "rxjs";
import { Nobody, ActorNotAuthorizedToInteractIn } from "robustive-ts";
import { isSignUpGoal, SignUp, SignUpScenes, SignUpUsecase } from "@/shared/service/application/usecases/nobody/signUp";
import { browserPopupRedirectResolver } from "firebase/auth";
import { Task } from "@/shared/service/domain/models/task";
import { ItemChangeType } from "@/shared/service/domain/interfaces/backend";
import { SignInStatus } from "@/shared/service/domain/interfaces/authenticator";
import { isObservingUsersTasksGoal, isObservingUsersTasksScene, ObservingUsersTasks, ObservingUsersTasksScenes, ObservingUsersTasksUsecase } from "@usecases/service/observingUsersTasks";
import { Service } from "@/shared/service/application/actors/service";
import { Actor } from "@/shared/service/application/actors";

type ImmutableTask = Readonly<Task>;

export interface UserStore extends Store {
    readonly signInStatus: SignInStatus | null;
    readonly idInvalidMessage: string | string[] | undefined;
    readonly passwordInvalidMessage: string | string[] | undefined;
    readonly signInFailureMessage: string | undefined;

    readonly userTasks: ImmutableTask[];
}

export interface UserBehavior extends Behavior<UserStore> {
    readonly store: UserStore;
    signUp: (context: SignUpScenario, actor: Actor) => void;
    signIn: (context: SignInScenario, actor: Actor) => void;
    signOut: (context: SignOutScenario, actor: Actor) => void;
    observingUsersTasks: (context: ObservingUsersTasksScenario, actor: Actor) => void;
}

export function createUserBehavior(controller: BehaviorController): UserBehavior {
    const t = inject(DICTIONARY_KEY) as Dictionary;
    const router = useRouter();
    const store = reactive<UserStore>({
        signInStatus: null

        , idInvalidMessage: "" // ホントは null でいいはずが...
        , passwordInvalidMessage: "" // ホントは null でいいはずが...
        , signInFailureMessage: undefined

        , userTasks: []
    });

    const _store = store as Mutable<UserStore>;

    return {
        store
        , signUp: (context: SignUpScenes, actor: Actor) => {
            const _shared = controller.stores.shared as Mutable<SharedStore>;
            let subscription: Subscription | null = null;
            subscription = new SignUpUsecase(context)
                .interactedBy(actor, {
                    next: ([ lastSceneContext, performedScenario]) => {
                        if (!isSignUpGoal(lastSceneContext)) { return; }
                        switch (lastSceneContext.scene) {
                        case SignUp.goals.onSuccessInPublishingThenServicePresentsHomeView:
                            const user = lastSceneContext.user;
                            const actor = new SignedInUser(user);
                            _shared.actor = actor;
                            router.replace("/");
                            break;

                        case SignUp.goals.onFailureInValidatingThenServicePresentsError: {
                            if (lastSceneContext.result === true) { return; }
                            const labelMailAddress = t.common.labels.mailAddress;
                            const labelPassword = t.common.labels.password;

                            switch (lastSceneContext.result.id) {
                            case "isRequired":
                                _store.idInvalidMessage = t.common.validations.isRequired(labelMailAddress);
                                break;
                            case "isMalformed":
                                _store.idInvalidMessage = t.common.validations.isMalformed(labelMailAddress);
                                break;
                            case null:
                                _store.idInvalidMessage = undefined;
                                break;
                            }

                            switch (lastSceneContext.result.password) {
                            case "isRequired":
                                _store.passwordInvalidMessage = t.common.validations.isRequired(labelPassword);
                                break;
                            case "isTooShort":
                                _store.passwordInvalidMessage = t.common.validations.isTooShort(labelPassword, 8);
                                break;
                            case "isTooLong":
                                _store.passwordInvalidMessage = t.common.validations.isTooLong(labelPassword, 20);
                                break;
                            case null:
                                _store.passwordInvalidMessage = undefined;
                                break;
                            }
                            break;
                        }
                        case SignUp.goals.onFailureInPublishingThenServicePresentsError:
                            console.log("SERVICE ERROR:", lastSceneContext.error);
                            break;
                        }
                    }
                    , complete: controller.commonCompletionProcess
                });
        }
        , signIn: (context: SignInScenes, actor: Actor) => {
            const _shared = controller.stores.shared as Mutable<SharedStore>;
            let subscription: Subscription | null = null;
            subscription = new SignInUsecase(context)
                .interactedBy(actor, {
                    next: ([lastSceneContext, performedScenario]) => {
                        if (!isSignInGoal(lastSceneContext)) { return; }
                        switch (lastSceneContext.scene) {
                        case SignIn.goals.onSuccessInSigningInThenServicePresentsHomeView:
                            router.replace("/");
                            break;

                        case SignIn.goals.onFailureInValidatingThenServicePresentsError: {
                            if (lastSceneContext.result === true) { return; }
                            const labelMailAddress = t.common.labels.mailAddress;
                            const labelPassword = t.common.labels.password;

                            switch (lastSceneContext.result.id) {
                            case "isRequired":
                                _store.idInvalidMessage = t.common.validations.isRequired(labelMailAddress);
                                break;
                            case "isMalformed":
                                _store.idInvalidMessage = t.common.validations.isMalformed(labelMailAddress);
                                break;
                            case null:
                                _store.idInvalidMessage = undefined;
                                break;
                            }

                            switch (lastSceneContext.result.password) {
                            case "isRequired":
                                _store.passwordInvalidMessage = t.common.validations.isRequired(labelPassword);
                                break;
                            case "isTooShort":
                                _store.passwordInvalidMessage = t.common.validations.isTooShort(labelPassword, 8);
                                break;
                            case "isTooLong":
                                _store.passwordInvalidMessage = t.common.validations.isTooLong(labelPassword, 20);
                                break;
                            case null:
                                _store.passwordInvalidMessage = undefined;
                                break;
                            }
                            break;
                        }
                        case SignIn.goals.onFailureInSigningInThenServicePresentsError: {
                            console.log("SERVICE ERROR:", lastSceneContext.error);
                            _store.signInFailureMessage = lastSceneContext.error.message;
                            break;
                        }
                        }
                    }
                    , error: (e) => {
                        _store.signInFailureMessage = e.message;
                    }
                    , complete: controller.commonCompletionProcess
                });
        }
        , signOut: (context: SignOutScenes, actor: Actor) => {
            const _shared = controller.stores.shared as Mutable<SharedStore>;
            let subscription: Subscription | null = null;
            subscription = new SignOutUsecase(context)
                .interactedBy(actor, {
                    next: ([lastSceneContext, performedScenario]) => {
                        if (!isSignOutGoal(lastSceneContext)) { return; }
                        switch (lastSceneContext.scene) {
                        case SignOut.goals.onSuccessThenServicePresentsSignInView:
                            controller.change(new Nobody());
                            _shared.signInStatus = SignInStatus.signOut;
                            break;
                        case SignOut.goals.onFailureThenServicePresentsError:
                            console.log("SERVICE ERROR:", lastSceneContext.error);
                            break;
                        case SignOut.goals.servicePresentsHomeView:
                            router.replace("/");
                        }
                    }
                    , complete: controller.commonCompletionProcess
                });
        }
        , observingUsersTasks: (context: ObservingUsersTasksScenes, actor: Actor) => {
            const _shared = controller.stores.shared as Mutable<SharedStore>;
            let subscription: Subscription | null = null;
            subscription = new ObservingUsersTasksUsecase(context)
                .interactedBy(actor, {
                    next: ([lastSceneContext, performedScenario]) => {
                        if (!isObservingUsersTasksGoal(lastSceneContext)) { return; }
                        switch (lastSceneContext.scene) {
                        case ObservingUsersTasks.goals.serviceDoNothing:
                            console.log("Started observing user's tasks...");
                            break;
                        case ObservingUsersTasks.goals.onUpdateUsersTasksThenServiceUpdateUsersTaskList:
                            const mutableUserTasks = _store.userTasks as Task[];
                            lastSceneContext.changedTasks.forEach(changedTask => {
                                switch (changedTask.kind) {
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
                            console.log("user's tasks: ", _store.userTasks);
                        }
                    }
                });
        }
    };
}