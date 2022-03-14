// service
import { Boot, BootScene } from "@usecases/boot";
import type { BootContext } from "@usecases/boot";

// system
import { Usecase } from "@shared/system/interfaces/usecase";
import { Subscription } from "rxjs";
import { reactive } from "vue";
import { State, Store, ViewModel } from ".";
import { useRouter } from "vue-router";
import { UserNotAuthorizedToInteract } from "@/shared/service/serviceErrors";

export type HomeState = State;

export interface HomeViewModel extends ViewModel<HomeState> {
    state: HomeState;
    boot: () => void;
}

export function createHomeViewModel(store: Store): HomeViewModel {
    const router = useRouter();
    const state = reactive<HomeState>({});

    return {
        state
        , boot: () => {
            let subscription: Subscription|null = null;
            subscription = new Usecase(null)
                .interact<BootContext, BootScene>(new BootScene())
                .subscribe({
                    next: (performedSenario) => {
                        const lastContext = performedSenario.slice(-1)[0];
                        switch (lastContext.scene) {
                        case Boot.sessionExistsThenServicePresentsHome:
                            store.user = { ...lastContext.user };
                            break;
                        case Boot.sessionNotExistsThenServicePresentsSignin:
                            router.replace("/signin");
                            break;
                        }
                    }
                    , error: (e) => {
                        if (e instanceof UserNotAuthorizedToInteract) {
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
