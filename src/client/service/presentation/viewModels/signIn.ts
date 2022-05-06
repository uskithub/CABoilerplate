import { isSignInGoal, SignIn, SignInUsecase } from "@/shared/service/application/usecases/signIn";
import { isSignOutGoal, SignOut, SignOutUsecase } from "@/shared/service/application/usecases/signOut";
import { Dictionary, DICTIONARY_KEY } from "@/shared/system/localizations";
import { Anyone, UserNotAuthorizedToInteractIn } from "robustive-ts";
// import { Anyone, UserNotAuthorizedToInteractIn } from "robustive-ts";
import { Subscription } from "rxjs";
import { inject, reactive } from "vue";
import { useRouter } from "vue-router";
import { LocalStore, Mutable, SharedStore, ViewModel } from ".";
import { SignedInUser } from "../../application/actors/signedInUser";

export interface SignInStore extends LocalStore {
    readonly isValid: boolean;
    readonly idInvalidMessage: string|string[]|null;
    readonly passwordInvalidMessage: string|string[]|null;
    readonly signInFailureMessage: string|null;
}

export interface SignInViewModel extends ViewModel<SignInStore> {
    readonly local: SignInStore;
    readonly isPresentDialog: boolean;
    signIn: (id: string|null, password: string|null)=>void;
    signOut: ()=>Promise<boolean>;
    goHome: ()=>void;
}

export function createSignInViewModel(shared: SharedStore): SignInViewModel {
    const t = inject(DICTIONARY_KEY) as Dictionary;
    const router = useRouter();
    const local = reactive<SignInStore>({
        isValid: true
        , idInvalidMessage: "" // ホントは null でいいはずが...
        , passwordInvalidMessage: "" // ホントは null でいいはずが...
        , signInFailureMessage: null
    });
    const _local = local as Mutable<SignInStore>;

    return {
        local
        , isPresentDialog: (shared.user !== null)
        , signIn: (id: string|null, password: string|null) => {
            // _local.idInvalidMessage = null;
            // _local.passwordInvalidMessage = null;
            let subscription: Subscription|null = null;
            subscription = new SignInUsecase({ scene: SignIn.userStartsSignInProcess, id, password })
                .interactedBy(new Anyone())
                .subscribe({
                    next: (performedScenario) => {
                        const lastContext = performedScenario.slice(-1)[0];
                        if (!isSignInGoal(lastContext)) { return; }
                        switch(lastContext.scene){
                        case SignIn.goals.onSuccessThenServicePresentsHomeView:
                            router.replace("/");
                            break;

                        case SignIn.goals.onFailureInValidatingThenServicePresentsError: {
                            if (lastContext.result === true){ return; }
                            const labelMailAddress = t.common.labels.mailAddress;
                            const labelPassword = t.common.labels.password;

                            switch (lastContext.result.id) {
                            case "isRequired":
                                _local.idInvalidMessage = t.common.validations.isRequired(labelMailAddress);
                                break;
                            case "isMalformed":
                                _local.idInvalidMessage = t.common.validations.isMalformed(labelMailAddress);
                                break;
                            case null:
                                _local.idInvalidMessage = null;
                                break;
                            }

                            switch (lastContext.result.password) {
                            case "isRequired":
                                _local.passwordInvalidMessage = t.common.validations.isRequired(labelPassword);
                                break;
                            case "isTooShort":
                                _local.passwordInvalidMessage = t.common.validations.isTooShort(labelPassword, 8);
                                break;
                            case "isTooLong":
                                _local.passwordInvalidMessage = t.common.validations.isTooLong(labelPassword, 20);
                                break;
                            case null:
                                _local.passwordInvalidMessage = null;
                                break;
                            }
                            break;
                        }
                        case SignIn.goals.onFailureInSigningInThenServicePresentsError: {
                            console.log("SERVICE ERROR:", lastContext.error);
                            _local.signInFailureMessage = lastContext.error.message;
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
                        _local.signInFailureMessage = e.message;
                    }
                    , complete: () => {
                        console.info("complete");
                        subscription?.unsubscribe();
                    }
                });
        }
        , signOut: (): Promise<boolean> => {
            return new Promise((resolve, reject) => {
                if (shared.user === null) { return resolve(false); }
                let subscription: Subscription|null = null;
                subscription = new SignOutUsecase()
                    .interactedBy(new SignedInUser(shared.user))
                    .subscribe({
                        next: (performedScenario) => {
                            console.log("signOut:", performedScenario);
                            const lastContext = performedScenario.slice(-1)[0];
                            if (!isSignOutGoal(lastContext)) { return reject(); }
                            switch(lastContext.scene){
                            case SignOut.goals.onSuccessThenServicePresentsSignInView:
                                resolve(true);
                                break;
                            case SignOut.goals.onFailureThenServicePresentsError:
                                console.log("SERVICE ERROR:", lastContext.error);
                                reject();
                                break;
                            }
                        }
                        , error: (e) => {
                            if (e instanceof UserNotAuthorizedToInteractIn) {
                                console.error(e);
                            } else {
                                console.error(e);
                            }
                            reject();
                        }
                        , complete: () => {
                            console.info("complete");
                            subscription?.unsubscribe();
                        }
                    });
            });
        }
        , goHome: () => {
            router.replace("/");
        }
    };
}