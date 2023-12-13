// service

// system
import { reactive } from "vue";
import { Performer, Store, Mutable, SharedStore, Dispatcher } from ".";
import { Subscription } from "rxjs";
import { InteractResultType, Nobody as NobodyActor } from "robustive-ts";

import { SignInStatus, SignInStatuses } from "@/shared/service/domain/interfaces/authenticator";

import { Actor } from "@/shared/service/application/actors";
import { Nobody } from "@/shared/service/application/actors/nobody";
import { SignedInUser } from "@/shared/service/application/actors/signedInUser";
import { Usecase, UsecasesOf } from "@/shared/service/application/usecases";
import { dictionary as t } from "@/client/main";

export interface AuthenticationStore extends Store {
    readonly signInStatus: SignInStatus | null;
    readonly idInvalidMessage: string | string[] | undefined;
    readonly passwordInvalidMessage: string | string[] | undefined;
    readonly signInFailureMessage: string | undefined;
}

export interface AuthenticationPerformer extends Performer<"authentication", AuthenticationStore> {
    readonly store: AuthenticationStore;
    dispatch: (usecase: UsecasesOf<"authentication">, actor: Actor, dispatcher: Dispatcher) => Promise<Subscription | void>;
}

export function createAuthenticationPerformer(): AuthenticationPerformer {
    const store = reactive<AuthenticationStore>({
        signInStatus: null

        , idInvalidMessage: "" // ホントは null でいいはずが...
        , passwordInvalidMessage: "" // ホントは null でいいはずが...
        , signInFailureMessage: undefined
    });

    const _store = store as Mutable<AuthenticationStore>;
    
    const signUp = (usecase: Usecase<"authentication", "signUp">, actor: Actor, dispatcher: Dispatcher): Promise<void> => {
        const goals = Nobody.usecases.signUp.goals;
        const _shared = dispatcher.stores.shared as Mutable<SharedStore>;
        return usecase
            .interactedBy(actor)
            .then(result => {
                if (result.type !== InteractResultType.success) { return; }
                const context = result.lastSceneContext;

                switch (context.scene) {
                case goals.onSuccessInCreateUserDataThenServicePresentsHomeView: {
                    const user = context.user;
                    const actor = new SignedInUser(user);
                    _shared.actor = actor;
                    dispatcher.routingTo("/");
                    break;
                }
                case goals.onFailureInValidatingThenServicePresentsError: {
                    if (context.result === true) { break; }
                    const labelMailAddress = t.authentication.common.labels.mailAddress;
                    const labelPassword = t.authentication.common.labels.password;

                    switch (context.result.id) {
                    case "isRequired":
                        _store.idInvalidMessage = t.authentication.common.validations.isRequired(labelMailAddress);
                        break;
                    case "isMalformed":
                        _store.idInvalidMessage = t.authentication.common.validations.isMalformed(labelMailAddress);
                        break;
                    case null:
                        _store.idInvalidMessage = undefined;
                        break;
                    }

                    switch (context.result.password) {
                    case "isRequired":
                        _store.passwordInvalidMessage = t.authentication.common.validations.isRequired(labelPassword);
                        break;
                    case "isTooShort":
                        _store.passwordInvalidMessage = t.authentication.common.validations.isTooShort(labelPassword, 8);
                        break;
                    case "isTooLong":
                        _store.passwordInvalidMessage = t.authentication.common.validations.isTooLong(labelPassword, 20);
                        break;
                    case null:
                        _store.passwordInvalidMessage = undefined;
                        break;
                    }
                    break;
                }
                case goals.onFailureInPublishingThenServicePresentsError: {
                    console.error("SERVICE ERROR:", context.error);
                    break;
                }
                case goals.onFailureInCreateUserDataThenServicePresentsError: {
                    console.error("SERVICE ERROR:", context.error);
                    break;
                }
                case goals.serviceDoNothing: {
                    break;
                }
                case goals.servicePresentsSignInView: {
                    dispatcher.routingTo("/signin");
                    break;
                }
                }
                return;
            });
    };
    
    const signIn = (usecase: Usecase<"authentication", "signIn">, actor: Actor, dispatcher: Dispatcher): Promise<void> => {
        const goals = Nobody.usecases.signIn.goals;
        const _shared = dispatcher.stores.shared as Mutable<SharedStore>;
        return usecase
            .interactedBy(actor)
            .then(result => {
                if (result.type !== InteractResultType.success) { return; }
                const context = result.lastSceneContext;
                switch (context.scene) {
                case goals.onSuccessInSigningInThenServicePresentsHomeView:
                    dispatcher.routingTo("/");
                    break;

                case goals.onFailureInValidatingThenServicePresentsError: {
                    if (context.result === true) { return; }
                    const labelMailAddress = t.authentication.common.labels.mailAddress;
                    const labelPassword = t.authentication.common.labels.password;

                    switch (context.result.id) {
                    case "isRequired":
                        _store.idInvalidMessage = t.authentication.common.validations.isRequired(labelMailAddress);
                        break;
                    case "isMalformed":
                        _store.idInvalidMessage = t.authentication.common.validations.isMalformed(labelMailAddress);
                        break;
                    case null:
                        _store.idInvalidMessage = undefined;
                        break;
                    }

                    switch (context.result.password) {
                    case "isRequired":
                        _store.passwordInvalidMessage = t.authentication.common.validations.isRequired(labelPassword);
                        break;
                    case "isTooShort":
                        _store.passwordInvalidMessage = t.authentication.common.validations.isTooShort(labelPassword, 8);
                        break;
                    case "isTooLong":
                        _store.passwordInvalidMessage = t.authentication.common.validations.isTooLong(labelPassword, 20);
                        break;
                    case null:
                        _store.passwordInvalidMessage = undefined;
                        break;
                    }
                    break;
                }
                case goals.onFailureInSigningInThenServicePresentsError: {
                    console.error("SERVICE ERROR:", context.error);
                    _store.signInFailureMessage = context.error.message;
                    break;
                }
                case goals.servicePresentsSignUpView: {
                    dispatcher.routingTo("/signup");
                    break;
                }
                }
            })
            .catch(e => {
                _store.signInFailureMessage = e.message;
            });
    };
    
    const signOut = (usecase: Usecase<"authentication", "signOut">, actor: Actor, dispatcher: Dispatcher): Promise<void> => {
        const goals = SignedInUser.usecases.signOut.goals;
        const _shared = dispatcher.stores.shared as Mutable<SharedStore>;
        return usecase
            .interactedBy(actor)
            .then(result => {
                if (result.type !== InteractResultType.success) { return; }
                const context = result.lastSceneContext;
                switch (context.scene) {
                case goals.onSuccessThenServicePresentsSignInView:
                    dispatcher.change(new NobodyActor());
                    _shared.signInStatus = SignInStatuses.signOut();
                    break;
                case goals.onFailureThenServicePresentsError:
                    console.error("SERVICE ERROR:", context.error);
                    break;
                case goals.servicePresentsHomeView:
                    dispatcher.routingTo("/");
                    break;
                }
            });
    };

    return {
        store
        , dispatch: (usecase: UsecasesOf<"authentication">, actor: Actor, dispatcher: Dispatcher): Promise<Subscription | void> => {
            switch (usecase.name) {
            case "signUp": {
                return signUp(usecase, actor, dispatcher);
            }
            case "signIn": {
                return signIn(usecase, actor, dispatcher);
            }
            case "signOut": {
                return signOut(usecase, actor, dispatcher);
            }
            }
        }
    };
}