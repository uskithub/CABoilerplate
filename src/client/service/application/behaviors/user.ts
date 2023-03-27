// service
import { Boot, BootScenario, BootUsecase, isBootGoal, isBootScene } from "@/shared/service/application/usecases/nobody/boot";
import { isSignInGoal, isSignInScene, SignIn, SignInScenario, SignInUsecase } from "@/shared/service/application/usecases/nobody/signIn";
import { isSignOutGoal, SignOut, SignOutScenario, SignOutUsecase } from "@/shared/service/application/usecases/signedInUser/signOut";
import { SignedInUser } from "@/shared/service/application/actors/signedInUser";

// system
import { Dictionary, DICTIONARY_KEY } from "@/shared/system/localizations";
import { inject, reactive } from "vue";
import { Behavior, Store, Mutable, SharedStore, BehaviorController } from ".";
import { useRouter } from "vue-router";
import { Subscription } from "rxjs";
import { Nobody, ActorNotAuthorizedToInteractIn } from "robustive-ts";
import { isSignUpGoal, SignUp, SignUpScenario, SignUpUsecase } from "@/shared/service/application/usecases/nobody/signUp";
import { browserPopupRedirectResolver } from "firebase/auth";
import { Task } from "@/shared/service/domain/models/task";
import { ItemChangeType } from "@/shared/service/domain/interfaces/backend";
import { SignInStatus } from "@/shared/service/domain/interfaces/authenticator";
import { isObservingUsersTasksGoal, isObservingUsersTasksScene, ObservingUsersTasks, ObservingUsersTasksScenario, ObservingUsersTasksUsecase } from "@usecases/service/observingUsersTasks";
import { Service } from "@/shared/service/application/actors/service";

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
    signUp: (context: SignUpScenario) => void;
    signIn: (context: SignInScenario) => void;
    signOut: (context: SignOutScenario) => void;
    observingUsersTasks: (context: ObservingUsersTasksScenario) => void;
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
        , signUp: (context: SignUpScenario) => {
            const _shared = controller.stores.shared as Mutable<SharedStore>;
            let subscription: Subscription;
            subscription = new SignUpUsecase(context)
                .interactedBy(controller.stores.shared.actor)
                .subscribe({
                    next: (performedScenario: SignUpScenario[]) => {
                        const lastSceneContext = performedScenario.slice(-1)[0];
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
                    , error: (e) => {
                        if (e instanceof ActorNotAuthorizedToInteractIn) {
                            console.error(e);
                        } else {
                            console.error(e);
                        }
                    }
                    , complete: () => {
                        console.info("complete");
                        subscription.unsubscribe();
                    }
                });
        }
        , signIn: (context: SignInScenario) => {
            // _local.idInvalidMessage = null;
            // _local.passwordInvalidMessage = null;
            const _shared = controller.stores.shared as Mutable<SharedStore>;
            let subscription: Subscription;
            subscription = new SignInUsecase(context)
                .interactedBy(controller.stores.shared.actor)
                .subscribe({
                    next: (performedScenario: SignInScenario[]) => {
                        const lastSceneContext = performedScenario.slice(-1)[0];
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
                        if (e instanceof ActorNotAuthorizedToInteractIn) {
                            console.error(e);
                        } else {
                            console.error(e);
                        }
                        _store.signInFailureMessage = e.message;
                    }
                    , complete: () => {
                        const executingUsecase = _shared.executingUsecase;
                        if (executingUsecase && isSignInScene(executingUsecase.executing)) {
                            const elapsedTime = (new Date().getTime() - executingUsecase.startAt.getTime());
                            _shared.executingUsecase = null;
                            console.log(`The SignInScenerio takes ${elapsedTime} ms.`);
                        }
                        console.info("complete");
                        subscription.unsubscribe();
                    }
                });
        }
        , signOut: (context: SignOutScenario) => {
            const _shared = controller.stores.shared as Mutable<SharedStore>;
            let subscription: Subscription;
            subscription = new SignOutUsecase(context)
                .interactedBy(controller.stores.shared.actor)
                .subscribe({
                    next: (performedScenario: SignOutScenario[]) => {
                        console.log("signOut:", performedScenario);
                        const lastSceneContext = performedScenario.slice(-1)[0];
                        if (!isSignOutGoal(lastSceneContext)) { return; }
                        switch (lastSceneContext.scene) {
                            case SignOut.goals.onSuccessThenServicePresentsSignInView:
                                _shared.actor = new Nobody();
                                _shared.signInStatus = SignInStatus.signOut;
                                break;
                            case SignOut.goals.onFailureThenServicePresentsError:
                                console.log("SERVICE ERROR:", lastSceneContext.error);
                                break;
                            case SignOut.goals.servicePresentsHomeView:
                                router.replace("/");
                        }
                    }
                    , error: (e) => {
                        if (e instanceof UserNotAuthorizedToInteractIn) {
                            console.error(e);
                        } else {
                            console.error(e);
                        }
                    }
                    , complete: () => {
                        console.info("complete");
                        subscription.unsubscribe();
                    }
                });
        }
        , observingUsersTasks: (context: ObservingUsersTasksScenario) => {
            const _shared = controller.stores.shared as Mutable<SharedStore>;
            let subscription: Subscription;
            subscription = new ObservingUsersTasksUsecase(context)
                .interactedBy(new Service())
                .subscribe({
                    next: (performedScenario: ObservingUsersTasksScenario[]) => {
                        // observingUsersTasks はタスクの監視が後ろにくっ付くので complete が呼ばれないためここで計測する
                        const executingUsecase = _shared.executingUsecase;
                        if (executingUsecase && isObservingUsersTasksScene(executingUsecase.executing)) {
                            const elapsedTime = (new Date().getTime() - executingUsecase.startAt.getTime());
                            _shared.executingUsecase = null;
                            console.info(`The ObservingUsersTasksScenario takes ${elapsedTime} ms.`);
                        }
                        console.log("observingUsersTasks:", performedScenario);
                        const lastSceneContext = performedScenario.slice(-1)[0];
                        if (!isObservingUsersTasksGoal(lastSceneContext)) { return; }
                        switch (lastSceneContext.scene) {
                            case ObservingUsersTasks.goals.serviceDoNothing:
                                console.log("Started observing user's tasks...");
                                break;
                            case ObservingUsersTasks.goals.onUpdateUsersTasksThenServiceUpdateUsersTaskList:
                                let mutableUserTasks = _store.userTasks as Task[];
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
                    , error: (e) => {
                        if (e instanceof ActorNotAuthorizedToInteractIn) {
                            console.error(e);
                        } else {
                            console.error(e);
                        }
                    }
                    , complete: () => {
                        const executingUsecase = _shared.executingUsecase;
                        if (executingUsecase && executingUsecase instanceof BootUsecase) {
                            const elapsedTime = (new Date().getTime() - executingUsecase.startAt.getTime());
                            _shared.executingUsecase = null;
                            console.info(`complete - BootUsecase takes ${elapsedTime} ms`);
                        } else {
                            console.info("complete");
                        }
                        subscription.unsubscribe();
                    }
                });
        }
    };
}