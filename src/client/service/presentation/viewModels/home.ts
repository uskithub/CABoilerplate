// service
import { Boot, BootUsecase } from "@usecases/boot";

// system
import { reactive } from "vue";
import { State, Store, ViewModel } from ".";
import { useRouter } from "vue-router";
import { Anyone, UserNotAuthorizedToInteractIn } from "robustive-ts";
import { Subscription } from "rxjs";

export type HomeState = State;

export interface HomeViewModel extends ViewModel<HomeState> {
    state: HomeState;
    boot: ()=>void;
}

export function createHomeViewModel(store: Store): HomeViewModel {
    const router = useRouter();
    const state = reactive<HomeState>({});

    return {
        state
        , boot: () => {
            let subscription: Subscription|null = null;
            subscription = new Anyone()
                .interactIn(new BootUsecase())
                .subscribe({
                    next: performedSenario => {
                        console.log("boot:", performedSenario);
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
