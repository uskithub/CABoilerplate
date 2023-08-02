// service

// system
import { Dictionary, DICTIONARY_KEY } from "@/shared/system/localizations";
import { inject, reactive } from "vue";
import { Performer, Dispatcher, Mutable, SharedStore, Store } from ".";
import { useRouter } from "vue-router";
import { Subscription } from "rxjs";
import { ActorNotAuthorizedToInteractIn } from "robustive-ts";
import { Task } from "@/shared/service/domain/entities/task";
import { ItemChangeType } from "@/shared/service/domain/interfaces/backend";
import { SignInStatus } from "@/shared/service/domain/interfaces/authenticator";
import { SignedInUser } from "@/shared/service/application/actors/signedInUser";
import { Actor } from "@/shared/service/application/actors";
import { NobodyUsecases } from "@/shared/service/application/usecases/nobody";
import { Usecase } from "@/shared/service/application/usecases";


export type ApplicationStore = Store
export interface ApplicationPerformer extends Performer<ApplicationStore> {
    readonly store: ApplicationStore;
    boot: (usecase: Usecase<"boot">, actor: Actor) => void;
}

export function createApplicationPerformer(dispatcher: Dispatcher): ApplicationPerformer {
    const t = inject(DICTIONARY_KEY) as Dictionary;
    const router = useRouter();

    const store = reactive<ApplicationStore>({
    });

    return {
        store
        , boot: (usecase: Usecase<"boot">, actor: Actor) => {
            const _u = NobodyUsecases.boot;
            const _shared = dispatcher.stores.shared as Mutable<SharedStore>;
            let subscription: Subscription | null = null;
            subscription = usecase
                .interactedBy(actor, {
                    next: ([lastSceneContext]) => {
                        switch (lastSceneContext.scene) {
                        case _u.goals.sessionExistsThenServicePresentsHome: {
                            const user = { ...lastSceneContext.user };
                            const actor = new SignedInUser(user);
                            dispatcher.change(actor);
                            _shared.signInStatus = SignInStatus.signIn;
                            console.log("hhhh", _shared.actor, _shared.signInStatus);
                            // controller.dispatch({ scene: ObservingUsersTasks.serviceDetectsSigningIn, user });
                            break;
                        }
                        case _u.goals.sessionNotExistsThenServicePresentsSignin: {
                            _shared.signInStatus = SignInStatus.signOut;
                            router.replace("/signin")
                                .catch((error: Error) => {
                                });
                            break;
                        }
                        }
                    }
                    , complete: dispatcher.commonCompletionProcess
                });
        }
    };
}