// service
import { Boot, BootScenario, BootUsecase, isBootGoal } from "@usecases/boot";
import { isSignInGoal, SignIn, SignInScenario, SignInUsecase } from "@/shared/service/application/usecases/signIn";
import { isSignOutGoal, SignOut, SignOutScenario, SignOutUsecase } from "@/shared/service/application/usecases/signOut";
import { SignedInUser } from "../../application/actors/signedInUser";

// system
import { Dictionary, DICTIONARY_KEY } from "@/shared/system/localizations";
import { inject, reactive } from "vue";
import { LocalStore, Mutable, SharedStore, ViewModel } from ".";
import { useRouter } from "vue-router";
import { Subscription } from "rxjs";
import { Nobody, UserNotAuthorizedToInteractIn } from "robustive-ts";
import { isSignUpGoal, SignUp, SignUpScenario, SignUpUsecase } from "@/shared/service/application/usecases/signUp";


export interface UserStore extends LocalStore {
    readonly idInvalidMessage: string|string[]|null;
    readonly passwordInvalidMessage: string|string[]|null;
    readonly signInFailureMessage: string|null;
}

export interface UserModel extends ViewModel<UserStore> {
    readonly store: UserStore;
    boot: (context: BootScenario)=>void;
    signUp: (context: SignUpScenario)=>void;
    signIn: (context: SignInScenario)=>void;
    signOut: (context: SignOutScenario)=>void;
}

export function createUserModel(shared: SharedStore): UserModel {
    const t = inject(DICTIONARY_KEY) as Dictionary;
    const router = useRouter();
    const store = reactive<UserStore>({
        idInvalidMessage: "" // ホントは null でいいはずが...
        , passwordInvalidMessage: "" // ホントは null でいいはずが...
        , signInFailureMessage: null
    });

    const _shared = shared as Mutable<SharedStore>;
    const _store = store as Mutable<UserStore>;

    return {
        store
        , boot: (context: BootScenario) => {
            let subscription: Subscription|null = null;
            subscription = new BootUsecase(context)
                .interactedBy(new Nobody())
                .subscribe({
                    next: performedScenario => {
                        console.log("boot:", performedScenario);
                        const lastSceneContext = performedScenario.slice(-1)[0];
                        if (!isBootGoal(lastSceneContext)) { return; }
                        switch (lastSceneContext.scene) {
                        case Boot.goals.servicePresentsHome:
                            _shared.user = { ...lastSceneContext.user };
                            break;
                        case Boot.goals.sessionNotExistsThenServicePresentsSignin:
                            router.replace("/signin");
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
        , signUp: (context: SignUpScenario) => {
            let subscription: Subscription|null = null;
            subscription = new SignUpUsecase(context)
                .interactedBy(new Nobody())
                .subscribe({
                    next: (performedScenario) => {
                        const lastSceneContext = performedScenario.slice(-1)[0];
                        if (!isSignUpGoal(lastSceneContext)) { return; }
                        switch(lastSceneContext.scene){
                        case SignUp.goals.onSuccessInPublishingThenServicePresentsHomeView:
                            _shared.user = lastSceneContext.user;
                            router.replace("/");
                            break;

                        case SignUp.goals.onFailureInValidatingThenServicePresentsError: {
                            if (lastSceneContext.result === true){ return; }
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
            let subscription: Subscription|null = null;
            subscription = new SignInUsecase(context)
                .interactedBy(new Nobody())
                .subscribe({
                    next: (performedScenario) => {
                        const lastSceneContext = performedScenario.slice(-1)[0];
                        if (!isSignInGoal(lastSceneContext)) { return; }
                        switch(lastSceneContext.scene){
                        case SignIn.goals.onSuccessThenServicePresentsHomeView:
                            router.replace("/");
                            break;

                        case SignIn.goals.onFailureInValidatingThenServicePresentsError: {
                            if (lastSceneContext.result === true){ return; }
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
                        console.info("complete");
                        subscription?.unsubscribe();
                    }
                });
        }
        , signOut: (context: SignOutScenario) => {
            if (shared.user === null) { return; }
            let subscription: Subscription|null = null;
            subscription = new SignOutUsecase(context)
                .interactedBy(new SignedInUser(shared.user))
                .subscribe({
                    next: (performedScenario) => {
                        console.log("signOut:", performedScenario);
                        const lastSceneContext = performedScenario.slice(-1)[0];
                        if (!isSignOutGoal(lastSceneContext)) { return; }
                        switch(lastSceneContext.scene){
                        case SignOut.goals.onSuccessThenServicePresentsSignInView:
                            _shared.user = null;
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
