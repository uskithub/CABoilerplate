import { Actor } from "@/shared/service/application/actors";
import { ListInsuranceItemsScenario, ListInsuranceItemsScenes } from "@/shared/service/application/usecases/ServiceInProcess/signedInUser/listInsuranceItems";
import { InsuranceItem } from "@/shared/service/infrastructure/API";
import { Dictionary, DICTIONARY_KEY } from "@/shared/system/localizations";
import { Performer, Dispatcher, Mutable, SharedStore, Store } from ".";

// System
import { inject, reactive } from "vue";
import { Subscription } from "rxjs";
import { useRouter } from "vue-router";
import { SignInUserUsecases } from "@/shared/service/application/usecases/signedInUser";
import { Scene } from "robustive-ts";

export interface ServiceInProcessStore extends Store {
    insuranceItems: InsuranceItem[]|null
}
export interface ServiceInProcessPerformer extends Performer<ServiceInProcessStore> {
    readonly store: ServiceInProcessStore;
    list: (from: Scene<ListInsuranceItemsScenes, ListInsuranceItemsScenario>, actor: Actor) => void;
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
        , list: (from: Scene<ListInsuranceItemsScenes, ListInsuranceItemsScenario>, actor: Actor) => {
            const _u = SignInUserUsecases.listInsuranceItems;
            const _shared = dispatcher.stores.shared as Mutable<SharedStore>;
            let subscription: Subscription | null = null;
            subscription = from
                .interactedBy(actor, {
                    next: ([lastSceneContext]) => {
                        switch (lastSceneContext.scene) {
                        case _u.goals.resultIsOneOrMoreThenServiceDisplaysResultOnInsuranceItemListView:
                            console.log("OKKKKKK", lastSceneContext.insuranceItems);
                            _store.insuranceItems = lastSceneContext.insuranceItems;
                            break;
                        case _u.goals.resultIsZeroThenServiceDisplaysNoResultOnInsuranceItemListView:
                            _store.insuranceItems = null;
                            break;
                        }
                    }
                    , complete: dispatcher.commonCompletionProcess
                });
        }
    };
}