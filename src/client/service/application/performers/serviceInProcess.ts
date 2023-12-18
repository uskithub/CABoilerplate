import { Actor } from "@/shared/service/application/actors";
import { InsuranceItem } from "@/shared/service/infrastructure/API";
import { Dictionary, DICTIONARY_KEY } from "@/shared/system/localizations";
import { Performer, Dispatcher, Mutable, SharedStore, Store } from ".";

// System
import { inject, reactive } from "vue";
import { Subscription } from "rxjs";
import { useRouter } from "vue-router";
import { AuthorizedUser } from "@/shared/service/application/actors/authorizedUser";
import { Usecase } from "@/shared/service/application/usecases";
import { InteractResultType } from "robustive-ts";

export interface ServiceInProcessStore extends Store {
    insuranceItems: InsuranceItem[]|null
}
export interface ServiceInProcessPerformer extends Performer<ServiceInProcessStore> {
    readonly store: ServiceInProcessStore;
    list: (usecase: Usecase<"projectManagement", "listInsuranceItems">, actor: Actor) => Promise<void>;
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
        , list: (usecase: Usecase<"projectManagement", "listInsuranceItems">, actor: Actor) : Promise<void> => {
            const goals = AuthorizedUser.usecases.listInsuranceItems.goals;
            const _shared = dispatcher.stores.shared as Mutable<SharedStore>;
            return usecase
                .interactedBy(actor)
                .then(result => {
                    if (result.type !== InteractResultType.success) { return; }
                    const context = result.lastSceneContext;
                    switch (context.scene) {
                    case goals.resultIsOneOrMoreThenServiceDisplaysResultOnInsuranceItemListView: {
                        console.log("OKKKKKK", context.insuranceItems);
                        _store.insuranceItems = context.insuranceItems;
                        break;
                    }
                    case goals.resultIsZeroThenServiceDisplaysNoResultOnInsuranceItemListView: {
                        _store.insuranceItems = null;
                        break;
                    }
                    }
                });
        }
    };
}