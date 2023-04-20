import { Actor } from "@/shared/service/application/actors";
import { ListInsuranceItems, isListInsuranceItemsGoal, ListInsuranceItemsScenario, ListInsuranceItemsUsecase } from "@/shared/service/application/usecases/ServiceInProcess/signedInUser/listInsuaranceItems";
import { InsuranceItem } from "@/shared/service/infrastructure/API";
import { Dictionary, DICTIONARY_KEY } from "@/shared/system/localizations";
import { Behavior, BehaviorController, Mutable, SharedStore, Store } from ".";

// System
import { inject, reactive } from "vue";
import { Subscription } from "rxjs";
import { useRouter } from "vue-router";
import { Usecase } from "robustive-ts";

export interface ServiceInProcessStore extends Store {
    insuranceItems: InsuranceItem[]|null
}
export interface ServiceInProcessBehavior extends Behavior<ServiceInProcessStore> {
    readonly store: ServiceInProcessStore;
    list: (context: ListInsuranceItemsScenario, actor: Actor) => void;
}

export function createServiceInProcessBehavior(controller: BehaviorController): ServiceInProcessBehavior {
    const t = inject(DICTIONARY_KEY) as Dictionary;
    const router = useRouter();

    const store = reactive<ServiceInProcessStore>({
        insuranceItems: null
    });

    const _store = store as Mutable<ServiceInProcessStore>;

    return {
        store
        , list: (context: ListInsuranceItemsScenario, actor: Actor) => {
            const _shared = controller.stores.shared as Mutable<SharedStore>;
            let subscription: Subscription | null = null;
            subscription = new ListInsuranceItemsUsecase(context)
                .interactedBy(actor, {
                    next: ([lastSceneContext, performedScenario]: [ListInsuranceItemsScenario, ListInsuranceItemsScenario[]]) => {
                        if (!isListInsuranceItemsGoal(lastSceneContext)) { return; }
                        switch (lastSceneContext.scene) {
                        case ListInsuranceItems.goals.resultIsOneOrMoreThenServiceDisplaysResultOnInsuranceItemListView:
                            console.log("OKKKKKK", lastSceneContext.insuranceItems);
                            _store.insuranceItems = lastSceneContext.insuranceItems;
                            break;
                        case ListInsuranceItems.goals.resultIsZeroThenServiceDisplaysNoResultOnInsuranceItemListView:
                            _store.insuranceItems = null;
                            break;
                        }
                    }
                    , complete: controller.commonCompletionProcess
                });
        }
    };
}