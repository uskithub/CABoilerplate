// service

// system
import { Dictionary, DICTIONARY_KEY } from "@/shared/system/localizations";
import { inject, reactive } from "vue";
import { Performer, Store, Mutable, SharedStore, Dispatcher } from ".";
import { useRouter } from "vue-router";
import { Subscription } from "rxjs";
import { InteractResultType, Nobody as NobodyActor } from "robustive-ts";

import { SignInStatus, SignInStatuses } from "@/shared/service/domain/interfaces/authenticator";

import { Actor } from "@/shared/service/application/actors";
import { Nobody } from "@/shared/service/application/actors/nobody";
import { SignedInUser } from "@/shared/service/application/actors/signedInUser";
import { Service } from "@/shared/service/application/actors/service";
import { U, Usecase } from "@/shared/service/application/usecases";

export interface AuthenticationStore extends Store {
    readonly signInStatus: SignInStatus | null;
    readonly idInvalidMessage: string | string[] | undefined;
    readonly passwordInvalidMessage: string | string[] | undefined;
    readonly signInFailureMessage: string | undefined;
}

export interface AuthenticationPerformer extends Performer<AuthenticationStore> {
    readonly store: AuthenticationStore;
    signUp: (usecase: Usecase<"signUp">, actor: Actor) => Promise<void>;
    signIn: (usecase: Usecase<"signIn">, actor: Actor) => Promise<void>;
    signOut: (usecase: Usecase<"signOut">, actor: Actor) => Promise<void>;
}

export function createAuthenticationPerformer(dispatcher: Dispatcher): AuthenticationPerformer {
    const t = inject(DICTIONARY_KEY) as Dictionary;
    const router = useRouter();
    const store = reactive<AuthenticationStore>({
        signInStatus: null

        , idInvalidMessage: "" // ホントは null でいいはずが...
        , passwordInvalidMessage: "" // ホントは null でいいはずが...
        , signInFailureMessage: undefined
    });

    const _store = store as Mutable<AuthenticationStore>;
    
    return {
        store
        , signUp: (usecase: Usecase<"signUp">, actor: Actor): Promise<void> => {
            const goals = Nobody.usecases.signUp.goals;
            const _shared = dispatcher.stores.shared as Mutable<SharedStore>;
            return usecase
                .interactedBy(actor)
                .then(result => {
                    if (result.type !== InteractResultType.success) { return; }
                    const context = result.lastSceneContext;

                    switch (context.scene) {
                    case goals.onSuccessInPublishingThenServicePresentsHomeView: {
                        const user = context.user;
                        const actor = new SignedInUser(user);
                        _shared.actor = actor;
                        router.replace("/");
                        break;
                    }
                    case goals.onFailureInValidatingThenServicePresentsError: {
                        if (context.result === true) { break; }
                        const labelMailAddress = t.common.labels.mailAddress;
                        const labelPassword = t.common.labels.password;

                        switch (context.result.id) {
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

                        switch (context.result.password) {
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
                    case goals.onFailureInPublishingThenServicePresentsError:
                        console.error("SERVICE ERROR:", context.error);
                        break;
                    }
                });
        }
        , signIn: (usecase: Usecase<"signIn">, actor: Actor): Promise<void> => {
            const goals = Nobody.usecases.signIn.goals;
            const _shared = dispatcher.stores.shared as Mutable<SharedStore>;
            return usecase
                .interactedBy(actor)
                .then(result => {
                    if (result.type !== InteractResultType.success) { return; }
                    const context = result.lastSceneContext;
                    switch (context.scene) {
                    case goals.onSuccessInSigningInThenServicePresentsHomeView:
                        router.replace("/");
                        break;

                    case goals.onFailureInValidatingThenServicePresentsError: {
                        if (context.result === true) { return; }
                        const labelMailAddress = t.common.labels.mailAddress;
                        const labelPassword = t.common.labels.password;

                        switch (context.result.id) {
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

                        switch (context.result.password) {
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
                    case goals.onFailureInSigningInThenServicePresentsError: {
                        console.error("SERVICE ERROR:", context.error);
                        _store.signInFailureMessage = context.error.message;
                        break;
                    }
                    }
                })
                .catch(e => {
                    _store.signInFailureMessage = e.message;
                });
        }
        , signOut: (usecase: Usecase<"signOut">, actor: Actor): Promise<void> => {
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
                        router.replace("/");
                        break;
                    }
                });
        }
    };
}