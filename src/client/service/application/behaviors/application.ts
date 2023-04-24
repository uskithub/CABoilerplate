// service
import { Boot, BootScenes, BootUsecase, isBootGoal, isBootScene } from "@usecases/nobody/boot";

// system
import { Dictionary, DICTIONARY_KEY } from "@/shared/system/localizations";
import { inject, reactive } from "vue";
import { Behavior, BehaviorController, BEHAVIOR_CONTROLLER_KEY, Mutable, SharedStore, Store } from ".";
import { useRouter } from "vue-router";
import { Subscription } from "rxjs";
import { ActorNotAuthorizedToInteractIn } from "robustive-ts";
import { Task } from "@/shared/service/domain/models/task";
import { ItemChangeType } from "@/shared/service/domain/interfaces/backend";
import { SignInStatus } from "@/shared/service/domain/interfaces/authenticator";
import { SignedInUser } from "@/shared/service/application/actors/signedInUser";
import { ObservingUsersTasks } from "@usecases/service/observingUsersTasks";
import { Actor } from "@/shared/service/application/actors";


export type ApplicationStore = Store
export interface ApplicationBehavior extends Behavior<ApplicationStore> {
    readonly store: ApplicationStore;
    boot: (context: BootScenario, actor: Actor) => void;
}

export function createApplicationBehavior(controller: BehaviorController): ApplicationBehavior {
    const t = inject(DICTIONARY_KEY) as Dictionary;
    const router = useRouter();

    const store = reactive<ApplicationStore>({
    });

    return {
        store
        , boot: (context: BootScenes, actor: Actor) => {
            const _shared = controller.stores.shared as Mutable<SharedStore>;
            let subscription: Subscription | null = null;
            subscription = new BootUsecase(context)
                .interactedBy(actor, {
                    next: ([lastSceneContext, performedScenario]: [BootScenes, BootScenes[]]) => {
                        if (!isBootGoal(lastSceneContext)) { return; }
                        switch (lastSceneContext.scene) {
                        case Boot.goals.sessionExistsThenServicePresentsHome:
                            const user = { ...lastSceneContext.user };
                            const actor = new SignedInUser(user);
                            controller.change(actor);
                            _shared.signInStatus = SignInStatus.signIn;
                            console.log("hhhh", _shared.actor, _shared.signInStatus);
                            // controller.dispatch({ scene: ObservingUsersTasks.serviceDetectsSigningIn, user });
                            break;
                        case Boot.goals.sessionNotExistsThenServicePresentsSignin:
                            _shared.signInStatus = SignInStatus.signOut;
                            router.replace("/signin");
                            break;
                        }
                    }
                    , complete: controller.commonCompletionProcess
                });
        }
    };
}