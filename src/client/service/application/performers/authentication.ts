// service
import { SignedInUser } from "@/shared/service/application/actors/signedInUser";

// system
import { Dictionary, DICTIONARY_KEY } from "@/shared/system/localizations";
import { inject, reactive } from "vue";
import { Performer, Store, Mutable, SharedStore, Dispatcher } from ".";
import { useRouter } from "vue-router";
import { Subscription } from "rxjs";
import { Nobody as NobodyActor, ActorNotAuthorizedToInteractIn } from "robustive-ts";

import { Task } from "@/shared/service/domain/entities/task";
import { ItemChangeType } from "@/shared/service/domain/interfaces/backend";
import { SignInStatus } from "@/shared/service/domain/interfaces/authenticator";

import { Service } from "@/shared/service/application/actors/service";
import { Actor } from "@/shared/service/application/actors";
import { Nobody } from "@/shared/service/application/usecases/nobody";
import { SignInUser } from "@/shared/service/application/usecases/signedInUser";
import { ServieceUsecases } from "@/shared/service/application/usecases/service";
import { Usecase } from "@/shared/service/application/usecases";

type ImmutableTask = Readonly<Task>;

export interface AuthenticationStore extends Store {
    readonly signInStatus: SignInStatus | null;
    readonly idInvalidMessage: string | string[] | undefined;
    readonly passwordInvalidMessage: string | string[] | undefined;
    readonly signInFailureMessage: string | undefined;

    readonly userTasks: ImmutableTask[];
}

export interface AuthenticationPerformer extends Performer<AuthenticationStore> {
    readonly store: AuthenticationStore;
    signUp: (usecase: Usecase<"signUp">, actor: Actor) => void;
    signIn: (usecase: Usecase<"signIn">, actor: Actor) => void;
    signOut: (usecase: Usecase<"signOut">, actor: Actor) => void;
    observingUsersTasks: (usecase: Usecase<"observingUsersTasks">, actor: Actor) => void;
}

export function createAuthenticationPerformer(dispatcher: Dispatcher): AuthenticationPerformer {
    const t = inject(DICTIONARY_KEY) as Dictionary;
    const router = useRouter();
    const store = reactive<AuthenticationStore>({
        signInStatus: null

        , idInvalidMessage: "" // ホントは null でいいはずが...
        , passwordInvalidMessage: "" // ホントは null でいいはずが...
        , signInFailureMessage: undefined

        , userTasks: []
    });

    const _store = store as Mutable<AuthenticationStore>;
    
    return {
        store
        , signUp: (usecase: Usecase<"signUp">, actor: Actor) => {
            const _u = Nobody.signUp;
            const _shared = dispatcher.stores.shared as Mutable<SharedStore>;
            let subscription: Subscription | null = null;
            subscription = usecase
                .interactedBy(actor, {
                    next: ([lastSceneContext]) => {
                        switch (lastSceneContext.scene) {
                        case _u.goals.onSuccessInPublishingThenServicePresentsHomeView: {
                            const user = lastSceneContext.user;
                            const actor = new SignedInUser(user);
                            _shared.actor = actor;
                            router.replace("/");
                            break;
                        }
                        case _u.goals.onFailureInValidatingThenServicePresentsError: {
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
                        case _u.goals.onFailureInPublishingThenServicePresentsError:
                            console.log("SERVICE ERROR:", lastSceneContext.error);
                            break;
                        }
                    }
                    , complete: dispatcher.commonCompletionProcess
                });
        }
        , signIn: (usecase: Usecase<"signIn">, actor: Actor) => {
            const _u = Nobody.signIn;
            const _shared = dispatcher.stores.shared as Mutable<SharedStore>;
            let subscription: Subscription | null = null;
            subscription = usecase
                .interactedBy(actor, {
                    next: ([lastSceneContext]) => {
                        switch (lastSceneContext.scene) {
                        case _u.goals.onSuccessInSigningInThenServicePresentsHomeView:
                            router.replace("/");
                            break;

                        case _u.goals.onFailureInValidatingThenServicePresentsError: {
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
                        case _u.goals.onFailureInSigningInThenServicePresentsError: {
                            console.log("SERVICE ERROR:", lastSceneContext.error);
                            _store.signInFailureMessage = lastSceneContext.error.message;
                            break;
                        }
                        }
                    }
                    , error: (e) => {
                        _store.signInFailureMessage = e.message;
                    }
                    , complete: dispatcher.commonCompletionProcess
                });
        }
        , signOut: (usecase: Usecase<"signOut">, actor: Actor) => {
            const _u = SignInUser.signOut;
            const _shared = dispatcher.stores.shared as Mutable<SharedStore>;
            let subscription: Subscription | null = null;
            subscription = usecase
                .interactedBy(actor, {
                    next: ([lastSceneContext]) => {
                        switch (lastSceneContext.scene) {
                        case _u.goals.onSuccessThenServicePresentsSignInView:
                            dispatcher.change(new NobodyActor());
                            _shared.signInStatus = SignInStatus.signOut;
                            break;
                        case _u.goals.onFailureThenServicePresentsError:
                            console.log("SERVICE ERROR:", lastSceneContext.error);
                            break;
                        case _u.goals.servicePresentsHomeView:
                            router.replace("/");
                        }
                    }
                    , complete: dispatcher.commonCompletionProcess
                });
        }
        , observingUsersTasks: (usecase: Usecase<"observingUsersTasks">, actor: Actor) => {
            const _u = ServieceUsecases.observingUsersTasks;
            const _shared = dispatcher.stores.shared as Mutable<SharedStore>;
            let subscription: Subscription | null = null;
            subscription = usecase
                .interactedBy(actor, {
                    next: ([lastSceneContext]) => {
                        switch (lastSceneContext.scene) {
                        case _u.goals.serviceDoNothing:
                            console.log("Started observing user's tasks...");
                            break;
                        case _u.goals.onUpdateUsersTasksThenServiceUpdateUsersTaskList:
                            const mutableUserTasks = _store.userTasks ;
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