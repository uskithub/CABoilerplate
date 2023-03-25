// service
import { Boot, BootScenario, BootUsecase, isBootGoal, isBootScene } from "@usecases/boot";
import { isSignInGoal, isSignInScene, SignIn, SignInScenario, SignInUsecase } from "@/shared/service/application/usecases/signIn";
import { isSignOutGoal, SignOut, SignOutScenario, SignOutUsecase } from "@/shared/service/application/usecases/signOut";
import { SignedInUser } from "../actors/signedInUser";

// system
import { Dictionary, DICTIONARY_KEY } from "@/shared/system/localizations";
import { inject, reactive } from "vue";
import { Behavior, Store, Mutable, SharedStore } from ".";
import { useRouter } from "vue-router";
import { Subscription } from "rxjs";
import { Nobody, UserNotAuthorizedToInteractIn } from "robustive-ts";
import { isSignUpGoal, SignUp, SignUpScenario, SignUpUsecase } from "@/shared/service/application/usecases/signUp";
import { browserPopupRedirectResolver } from "firebase/auth";
import { Task } from "@/shared/service/domain/models/task";
import { ItemChangeType } from "@/shared/service/domain/interfaces/backend";
import { SignInStatus } from "@/shared/service/domain/interfaces/authenticator";


type ImmutableTask = Readonly<Task>;

export interface UserStore extends Store {
    readonly signInStatus: SignInStatus | null;
    readonly idInvalidMessage: string | string[] | null;
    readonly passwordInvalidMessage: string | string[] | null;
    readonly signInFailureMessage: string | null;

    readonly userTasks: ImmutableTask[];
}

export interface UserBehavior extends Behavior<UserStore> {
    readonly store: UserStore;
    signUp: (context: SignUpScenario) => void;
    signIn: (context: SignInScenario) => void;
    signOut: (context: SignOutScenario) => void;
}

export function createUserBehavior(shared: SharedStore): UserBehavior {
    const t = inject(DICTIONARY_KEY) as Dictionary;
    const router = useRouter();
    const store = reactive<UserStore>({
        signInStatus: null

        , idInvalidMessage: "" // ホントは null でいいはずが...
        , passwordInvalidMessage: "" // ホントは null でいいはずが...
        , signInFailureMessage: null

        , userTasks: []
    });

    const _shared = shared as Mutable<SharedStore>;
    const _store = store as Mutable<UserStore>;

    return {
        store
        , signUp: (context: SignUpScenario) => {
            let subscription: Subscription | null = null;
            subscription = new SignUpUsecase(context)
                .interactedBy(shared.actor)
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
                                        _store.idInvalidMessage = null;
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
                                        _store.passwordInvalidMessage = null;
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
                        if (e instanceof UserNotAuthorizedToInteractIn) {
                            console.error(e);
                        } else {
                            console.error(e);
                        }
                    }
                    , complete: () => {
                        console.info("complete");
                        subscription?.unsubscribe();
                    }
                });
        }
        , signIn: (context: SignInScenario) => {
            // _local.idInvalidMessage = null;
            // _local.passwordInvalidMessage = null;
            let subscription: Subscription | null = null;
            subscription = new SignInUsecase(context)
                .interactedBy(shared.actor)
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
                                        _store.idInvalidMessage = null;
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
                                        _store.passwordInvalidMessage = null;
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
                        if (e instanceof UserNotAuthorizedToInteractIn) {
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
                        subscription?.unsubscribe();
                    }
                });
        }
        , signOut: (context: SignOutScenario) => {
            let subscription: Subscription | null = null;
            subscription = new SignOutUsecase(context)
                .interactedBy(shared.actor)
                .subscribe({
                    next: (performedScenario: SignOutScenario[]) => {
                        console.log("signOut:", performedScenario);
                        const lastSceneContext = performedScenario.slice(-1)[0];
                        if (!isSignOutGoal(lastSceneContext)) { return; }
                        switch (lastSceneContext.scene) {
                            case SignOut.goals.onSuccessThenServicePresentsSignInView:
                                _shared.actor = new Nobody();
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
                        subscription?.unsubscribe();
                    }
                });
        }
    };
}