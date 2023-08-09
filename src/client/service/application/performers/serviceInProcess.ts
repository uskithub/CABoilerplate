import { Actor } from "@/shared/service/application/actors";
import { InsuranceItem } from "@/shared/service/infrastructure/API";
import { Dictionary, DICTIONARY_KEY } from "@/shared/system/localizations";
import { Performer, Dispatcher, Mutable, SharedStore, Store } from ".";

// System
import { inject, reactive } from "vue";
import { Subscription } from "rxjs";
import { useRouter } from "vue-router";
import { SignInUser } from "@/shared/service/application/usecases/signedInUser";
import { Usecase } from "@/shared/service/application/usecases";

export interface ServiceInProcessStore extends Store {
    insuranceItems: InsuranceItem[]|null
}
export interface ServiceInProcessPerformer extends Performer<ServiceInProcessStore> {
    readonly store: ServiceInProcessStore;
    list: (usecase: Usecase<"listInsuranceItems">, actor: Actor) => void;
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
        , list: (usecase: Usecase<"listInsuranceItems">, actor: Actor) => {
            const goals = SignInUser.listInsuranceItems.goals;
            const _shared = dispatcher.stores.shared as Mutable<SharedStore>;
            let subscription: Subscription | null = null;
            subscription = usecase
                .interactedBy(actor, {
                    next: ([lastSceneContext]) => {
                        switch (lastSceneContext.scene) {
                        case goals.resultIsOneOrMoreThenServiceDisplaysResultOnInsuranceItemListView:
                            console.log("OKKKKKK", lastSceneContext.insuranceItems);
                            _store.insuranceItems = lastSceneContext.insuranceItems;
                            break;
                        case goals.resultIsZeroThenServiceDisplaysNoResultOnInsuranceItemListView:
                            _store.insuranceItems = null;
                            break;
                        }
                    }
                    , complete: () => dispatcher.commonCompletionProcess(subscription)
                });
        }
    };
}