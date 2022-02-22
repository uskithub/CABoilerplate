// service
import { Boot, BootScene } from "@usecases/boot";
import type { BootContext } from "@usecases/boot";

// system
import { Usecase } from "@/system/interfaces/usecase";
import { Subscription } from "rxjs";
import { reactive } from "vue";
import { State, ViewModel } from ".";
import { useRouter } from "vue-router";

export type HomeState = State;

export interface HomeViewModel extends ViewModel<HomeState> {
    state: HomeState;
    boot: () => void;
}

export function createHomeViewModel(): HomeViewModel {
    const state = reactive<HomeState>({});
    const router = useRouter();
    return {
        state
        , boot: () => {
            let subscription: Subscription | null = null;
            subscription = Usecase.interact<BootContext, BootScene>(
                new BootScene()
            ).subscribe({
                next: (performedSenario) => {
                    const lastContext = performedSenario.slice(-1)[0];
                    switch (lastContext.scene) {
                    case Boot.sessionExistsThenServicePresentsHome:
                        break;
                    case Boot.sessionNotExistsThenServicePresentsSignin:
                        router.replace("/signin");
                        break;
                    }
                }
                , error: (e) => console.error(e)
                , complete: () => {
                    console.info("complete");
                    subscription?.unsubscribe();
                }
            });
        }
    };
}
