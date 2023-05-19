import { Actor } from "@/shared/service/application/actors";
import { ListInsuranceItems, isListInsuranceItemsGoal, ListInsuranceItemsScenes, ListInsuranceItemsUsecase } from "@/shared/service/application/usecases/ServiceInProcess/signedInUser/listInsuranceItems";
import { InsuranceItem } from "@/shared/service/infrastructure/API";
import { Dictionary, DICTIONARY_KEY } from "@/shared/system/localizations";
import { Performer, Dispatcher, Mutable, SharedStore, Store } from ".";

// System
import { inject, reactive } from "vue";
import { Subscription } from "rxjs";
import { useRouter } from "vue-router";

export interface ServiceInProcessStore extends Store {
    insuranceItems: InsuranceItem[]|null
}
export interface ServiceInProcessPerformer extends Performer<ServiceInProcessStore> {
    readonly store: ServiceInProcessStore;
    list: (context: ListInsuranceItemsScenes, actor: Actor) => void;
}

export function createServiceInProcessPerformer(dispatcher: Dispatcher): ServiceInProcessPerformer {
    const t = inject(DICTIONARY_KEY) as Dictionary;
    const router = useRouter();

    const store = reactive<ServiceInProcessStore>({
        insuranceItems: null
    });

    const _store = store as Mutable<ServiceInProcessStore>;

    return {
        store
        , list: (context: ListInsuranceItemsScenes, actor: Actor) => {
            const _shared = dispatcher.stores.shared as Mutable<SharedStore>;
            let subscription: Subscription | null = null;
            subscription = new ListInsuranceItemsUsecase(context)
                .interactedBy(actor, {
                    next: ([lastSceneContext, performedScenario]) => {
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
                    , complete: dispatcher.commonCompletionProcess
                });
        }
    };
}