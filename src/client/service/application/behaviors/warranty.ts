// service
import { GetWarrantyList, GetWarrantyListScenario, GetWarrantyListUsecase, isGetWarrantyListGoal } from "@usecases/signedInUser/getWarrantyList";

// system
import { Dictionary, DICTIONARY_KEY } from "@/shared/system/localizations";
import { inject, reactive } from "vue";
import { Behavior, BehaviorController, Mutable, SharedStore, Store } from ".";
import { useRouter } from "vue-router";
import { Subscription } from "rxjs";
import { Actor } from "@/shared/service/application/actors";
import { Post } from "@/shared/service/infrastructure/API";


export interface WarrantyStore extends Store {
    warranties: Post[]
}
export interface WarrantyBehavior extends Behavior<WarrantyStore> {
    readonly store: WarrantyStore;
    get: (context: GetWarrantyListScenario, actor: Actor) => void;
}

export function createWarrantyBehavior(controller: BehaviorController): WarrantyBehavior {
    const t = inject(DICTIONARY_KEY) as Dictionary;
    const router = useRouter();

    const store = reactive<WarrantyStore>({
        warranties: []
    });

    const _store = store as Mutable<WarrantyStore>;

    return {
        store
        , get: (context: GetWarrantyListScenario, actor: Actor) => {
            const _shared = controller.stores.shared as Mutable<SharedStore>;
            let subscription: Subscription | null = null;
            subscription = new GetWarrantyListUsecase(context)
                .interactedBy(actor, {
                    next: ([lastSceneContext, performedScenario]: [GetWarrantyListScenario, GetWarrantyListScenario[]]) => {
                        if (!isGetWarrantyListGoal(lastSceneContext)) { return; }
                        switch (lastSceneContext.scene) {
                            case GetWarrantyList.goals.resultIsOneOrMoreThenServiceDisplaysResultOnWarrantyListView:
                                console.log("OKKKKKK", lastSceneContext.warranties);
                                _store.warranties = lastSceneContext.warranties;
                                break;
                            case GetWarrantyList.goals.resultIsZeroThenServiceDisplaysNoResultOnWarrantyListView:
                                _store.warranties = [];
                                break;
                        }
                    }
                    , complete: controller.commonCompletionProcess
                });
        }
    };
}