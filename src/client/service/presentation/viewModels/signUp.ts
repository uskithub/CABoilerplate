import { isSignUpGoal, SignUp, SignUpUsecase } from "@/shared/service/application/usecases/signUp";
import { isSignOutGoal, SignOut, SignOutUsecase } from "@/shared/service/application/usecases/signOut";
import { Subscription } from "rxjs";
import { inject, reactive } from "vue";
import { LocalStore, Mutable, SharedStore, ViewModel } from ".";
import { DICTIONARY_KEY } from "@/shared/system/localizations";
import type { Dictionary } from "@/shared/system/localizations";
import { useRouter } from "vue-router";
import { SignedInUser } from "../../application/actors/signedInUser";
import { Anyone, UserNotAuthorizedToInteractIn } from "robustive-ts";

export interface SignUpStore extends LocalStore {
    readonly isValid: boolean;
    readonly idInvalidMessage: string|string[]|null;
    readonly passwordInvalidMessage: string|string[]|null;
}

export interface SignUpViewModel extends ViewModel<SignUpStore> {
    readonly local: SignUpStore;
    readonly isPresentDialog: boolean;
    signUp: (id: string|null, password: string|null)=>void;
    signOut: ()=>Promise<boolean>;
    goHome: ()=>void;
}

export function createSignUpViewModel(shared: SharedStore): SignUpViewModel {
    const t = inject(DICTIONARY_KEY) as Dictionary;
    const router = useRouter();
    const local = reactive<SignUpStore>({
        isValid: true
        , idInvalidMessage: "" // ホントは null でいいはずが...
        , passwordInvalidMessage: "" // ホントは null でいいはずが...
    });

    const _shared = shared as Mutable<SharedStore>;
    const _local = local as Mutable<SignUpStore>;

    return {
        local
        , isPresentDialog: (shared.user !== null)
        , signUp: (id: string|null, password: string|null) => {
            let subscription: Subscription|null = null;
            subscription = new SignUpUsecase({ scene: SignUp.userStartsSignUpProcess, id, password })
                .interactedBy(new Anyone())
                .subscribe({
                    next: (performedScenario) => {
                        const lastContext = performedScenario.slice(-1)[0];
                        if (!isSignUpGoal(lastContext)) { return; }
                        switch(lastContext.scene){
                        case SignUp.goals.onSuccessInPublishingThenServicePresentsHomeView:
                            _shared.user = lastContext.user;
                            router.replace("/");
                            break;

                        case SignUp.goals.onFailureInValidatingThenServicePresentsError: {
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
                        case SignUp.goals.onFailureInPublishingThenServicePresentsError:
                            console.log("SERVICE ERROR:", lastContext.error);
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
            _local.isPresentDialog = false;
            router.replace("/");
        }
    };
}