// service
import { Boot, BootUsecase, isBootGoal } from "@usecases/boot";

// system
import { reactive } from "vue";
import { LocalStore, Mutable, SharedStore, ViewModel } from ".";
import { useRouter } from "vue-router";
import { Subscription } from "rxjs";
import { Anyone, UserNotAuthorizedToInteractIn } from "robustive-ts";

export type HomeStore = LocalStore;

export interface HomeViewModel extends ViewModel<HomeStore> {
    readonly local: HomeStore;
    boot: ()=>void;
}

export function createHomeViewModel(shared: SharedStore): HomeViewModel {
    const router = useRouter();
    const local = reactive<HomeStore>({});

    const _shared = shared as Mutable<SharedStore>;
    const _local = local as Mutable<HomeStore>;

    return {
        local
        , boot: () => {
            let subscription: Subscription|null = null;
            subscription = new BootUsecase()
                .interactedBy(new Anyone())
                .subscribe({
                    next: performedSenario => {
                        console.log("boot:", performedSenario);
                        const lastContext = performedSenario.slice(-1)[0];
                        if (!isBootGoal(lastContext)) { return; }
                        switch (lastContext.scene) {
                        case Boot.goals.sessionExistsThenServicePresentsHome:
                            _shared.user = { ...lastContext.user };
                            break;
                        case Boot.goals.sessionNotExistsThenServicePresentsSignin:
                            router.replace("/signin");
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
