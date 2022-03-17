import { SignUp, SignUpContext, SignUpUsecase } from "@/shared/service/application/usecases/signUp";
import { SignOut, SignOutContext, SignOutUsecase } from "@/shared/service/application/usecases/signOut";
import { Subscription } from "rxjs";
import { inject, reactive } from "vue";
import { State, Store, ViewModel } from ".";
import { DICTIONARY_KEY } from "@/shared/system/localizations";
import type { Dictionary } from "@/shared/system/localizations";
import { useRouter } from "vue-router";
import { Anyone, UserNotAuthorizedToInteractIn } from "robustive-ts";

export interface SignUpState extends State {
    isPresentDialog: boolean;
    email: string|null;
    password: string|null;
    isValid: boolean;
    idInvalidMessage: string|string[]|null;
    passwordInvalidMessage: string|string[]|null;
}

export interface SignUpViewModel extends ViewModel<SignUpState> {
    state: SignUpState
    signUp: (id: string|null, password: string|null)=>void
    signOut: ()=>void
}

export function createSignUpViewModel(store: Store): SignUpViewModel {
    const t = inject(DICTIONARY_KEY) as Dictionary;
    const router = useRouter();
    const state = reactive<SignUpState>({
        isPresentDialog: false
        , email: null
        , password: null
        , isValid: true
        , idInvalidMessage: null
        , passwordInvalidMessage: null
    });

    return {
        state
        , signUp: (id: string|null, password: string|null) => {
            let subscription: Subscription|null = null;
            subscription = new Anyone()
                .interactIn<SignUpContext, SignUpUsecase>(new SignUpUsecase({ scene: SignUp.userStartsSignUpProcess, id, password }))
                .subscribe({
                    next: (performedSenario) => {
                        const lastContext = performedSenario.slice(-1)[0];
                        switch(lastContext.scene){
                        case SignUp.onSuccessInPublishingThenServicePresentsHomeView:
                            store.user = lastContext.user;
                            router.replace("/signin");
                            break;

                        case SignUp.onFailureInValidatingThenServicePresentsError: {
                            if (lastContext.result === true){ return; }
                            const labelMailAddress = t.common.labels.mailAddress;
                            const labelPassword = t.common.labels.password;

                            switch (lastContext.result.id) {
                            case "isRequired":
                                state.idInvalidMessage = t.common.validations.isRequired(labelMailAddress);
                                break;
                            case "isMalformed":
                                state.idInvalidMessage = t.common.validations.isMalformed(labelMailAddress);
                                break;
                            case null:
                                state.idInvalidMessage = null;
                                break;
                            }

                            switch (lastContext.result.password) {
                            case "isRequired":
                                state.passwordInvalidMessage = t.common.validations.isRequired(labelPassword);
                                break;
                            case "isTooShort":
                                state.passwordInvalidMessage = t.common.validations.isTooShort(labelPassword, 8);
                                break;
                            case "isTooLong":
                                state.passwordInvalidMessage = t.common.validations.isTooLong(labelPassword, 20);
                                break;
                            case null:
                                state.passwordInvalidMessage = null;
                                break;
                            }
                            break;
                        }
                        case SignUp.onFailureInPublishingThenServicePresentsError:
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
        , signOut: () => {
            let subscription: Subscription|null = null;
            subscription = new Anyone()
                .interactIn<SignOutContext, SignOutUsecase>(new SignOutUsecase())
                .subscribe({
                    next: (performedSenario) => {
                        const lastContext = performedSenario.slice(-1)[0];
                        switch(lastContext.scene){
                        case SignOut.onSuccessThenServicePresentsSignInView:
                            state.isPresentDialog = false;
                            break;
                        case SignOut.onFailureThenServicePresentsError:
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
    };
}