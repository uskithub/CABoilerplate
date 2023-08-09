// service

// system
import { Dictionary, DICTIONARY_KEY } from "@/shared/system/localizations";
import { inject, reactive } from "vue";
import { Performer, Dispatcher, Mutable, SharedStore, Store } from ".";
import { useRouter } from "vue-router";
import { Subscription } from "rxjs";
import { SignInStatuses } from "@/shared/service/domain/interfaces/authenticator";
import { SignedInUser } from "@/shared/service/application/actors/signedInUser";
import { Actor } from "@/shared/service/application/actors";
import { Nobody } from "@/shared/service/application/usecases/nobody";
import { Usecase } from "@/shared/service/application/usecases";
import { U } from "@/shared/service/application/usecases";
import { Service } from "@/shared/service/application/usecases/service";


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
            const goals = Nobody.boot.goals;
            const _shared = dispatcher.stores.shared as Mutable<SharedStore>;
            let subscription: Subscription | null = null;
            subscription = usecase
                .interactedBy(actor, {
                    next: ([lastSceneContext]) => {
                        switch (lastSceneContext.scene) {
                        case goals.sessionExistsThenServicePresentsHome: {
                            const user = { ...lastSceneContext.user };
                            const actor = new SignedInUser(user);
                            dispatcher.change(actor);
                            _shared.signInStatus = SignInStatuses.signIn({ user });
                            dispatcher.dispatch(U.observingUsersTasks.basics[Service.observingUsersTasks.basics.serviceDetectsSigningIn]({ user }));
                            break;
                        }
                        case goals.sessionNotExistsThenServicePresentsSignin: {
                            _shared.signInStatus = SignInStatuses.signOut();
                            router.replace("/signin")
                                .catch((error: Error) => {
                                });
                            break;
                        }
                        }
                    }
                    , complete: () => dispatcher.commonCompletionProcess(subscription)
                });
        }
    };
}