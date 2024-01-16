// service
import { Performer, Store, Mutable, SharedStore, Dispatcher } from ".";
import { SignInStatus, SignInStatuses } from "@/shared/service/domain/interfaces/authenticator";

import { Actor } from "@/shared/service/application/actors";
import { AuthorizedUser } from "@/shared/service/application/actors/authorizedUser";
import { R, Usecase, UsecasesOf } from "@/shared/service/application/usecases";
import { dictionary as t } from "@/client/main";
import { fa } from "vuetify/lib/iconsets/fa-svg.mjs";
import { Account } from "@/shared/service/domain/authentication/user";

// system
import { reactive } from "vue";
import { Subscription } from "rxjs";
import { InteractResultType } from "robustive-ts";
import { Nobody } from "@/shared/service/application/actors/nobody";



export interface AuthenticationStore extends Store {
    readonly signInStatus: SignInStatus | null;
    readonly idInvalidMessage: string | string[] | undefined;
    readonly passwordInvalidMessage: string | string[] | undefined;
    readonly signInFailureMessage: string | undefined;
    readonly isPresentAdministratorRegistrationDialog: boolean;
    readonly domain: string | null;
    readonly account: Account | null;
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
        , isPresentAdministratorRegistrationDialog: false
        , domain : null
        , account : null
    });

    const _store = store as Mutable<AuthenticationStore>;

    const d = R.authentication;
    
    const signUp = (usecase: Usecase<"authentication", "signUp">, actor: Actor, dispatcher: Dispatcher): Promise<void> => {
        const goals = d.signUp.keys.goals;
        const _shared = dispatcher.stores.shared as Mutable<SharedStore>;
        return usecase
            .interactedBy(actor)
            .then(result => {
                if (result.type !== InteractResultType.success) {
                    return console.error("TODO", result);
                }
                const context = result.lastSceneContext;

                switch (context.scene) {
                case goals.onSuccessInCreateUserDataThenServicePresentsHomeView: {
                    const userProperties = context.userProperties;
                    const actor = new AuthorizedUser(userProperties);
                    dispatcher.change(actor);
                    _shared.signInStatus = SignInStatuses.signIn({ userProperties });
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
                case goals.onFailureInCreatingUserDataThenServicePresentsError: {
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
                case goals.domainOrganizationNotExistsThenServicePresentsAdministratorRegistrationDialog: {
                    _store.domain = context.domain;
                    _store.account = context.account;
                    _store.isPresentAdministratorRegistrationDialog = true;
                    _shared.isLoading = false;
                    break;
                }
                }
                return;
            });
    };
    
    const signIn = (usecase: Usecase<"authentication", "signIn">, actor: Actor, dispatcher: Dispatcher): Promise<void> => {
        const goals = d.signIn.keys.goals;
        const _shared = dispatcher.stores.shared as Mutable<SharedStore>;
        return usecase
            .interactedBy(actor)
            .then(result => {
                if (result.type !== InteractResultType.success) {
                    return console.error("TODO", result);
                }
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
        const goals = d.signOut.keys.goals;
        const _shared = dispatcher.stores.shared as Mutable<SharedStore>;
        return usecase
            .interactedBy(actor)
            .then(result => {
                if (result.type !== InteractResultType.success) {
                    return console.error("TODO", result);
                }
                const context = result.lastSceneContext;
                switch (context.scene) {
                case goals.onSuccessThenServicePresentsSignInView:
                    dispatcher.change(new Nobody());
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