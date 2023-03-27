// service
import { Boot, BootScenario, BootUsecase, isBootGoal, isBootScene } from "@usecases/nobody/boot";

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


export interface ApplicationStore extends Store {}
export interface ApplicationBehavior extends Behavior<ApplicationStore> {
    readonly store: ApplicationStore;
    boot: (context: BootScenario) => void;
}

export function createApplicationBehavior(controller: BehaviorController): ApplicationBehavior {
    const t = inject(DICTIONARY_KEY) as Dictionary;
    const router = useRouter();

    const store = reactive<ApplicationStore>({
    });

    return {
        store
        , boot: (context: BootScenario) => {
            const _shared = controller.stores.shared as Mutable<SharedStore>;
            let subscription: Subscription;
            subscription = new BootUsecase(context)
                .interactedBy(controller.stores.shared.actor)
                .subscribe({
                    next: (performedScenario: BootScenario[]) => {
                        console.log("boot:", performedScenario);
                        const lastSceneContext = performedScenario.slice(-1)[0];
                        if (!isBootGoal(lastSceneContext)) { return; }
                        switch (lastSceneContext.scene) {
                            case Boot.goals.sessionExistsThenServicePresentsHome:
                                const user = { ...lastSceneContext.user };
                                const actor = new SignedInUser(user);
                                _shared.actor = actor;
                                _shared.signInStatus = SignInStatus.signIn;
                                console.log("hhhh", _shared.actor, _shared.signInStatus);
                                controller.dispatch({ scene: ObservingUsersTasks.serviceDetectsSigningIn, user });
                                break;
                            case Boot.goals.sessionNotExistsThenServicePresentsSignin:
                                _shared.signInStatus = SignInStatus.signOut;
                                router.replace("/signin");
                                break;
                        }
                    }
                    , error: (e) => {
                        if (e instanceof ActorNotAuthorizedToInteractIn) {
                            console.error(e);
                        } else {
                            console.error(e);
                        }
                    }
                    , complete: () => {
                        const executingUsecase = _shared.executingUsecase;
                        if (executingUsecase && executingUsecase instanceof BootUsecase) {
                            const elapsedTime = (new Date().getTime() - executingUsecase.startAt.getTime());
                            _shared.executingUsecase = null;
                            console.info(`complete - BootUsecase takes ${elapsedTime} ms`);
                        } else {
                            console.info("complete");
                        }
                        subscription.unsubscribe();
                    }
                });
        }
    };
}