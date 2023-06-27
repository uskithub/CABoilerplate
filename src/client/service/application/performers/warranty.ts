// service
import { GetWarrantyList, GetWarrantyListScenes, GetWarrantyListUsecase, isGetWarrantyListGoal } from "@usecases/signedInUser/getWarrantyList";

// system
import { Dictionary, DICTIONARY_KEY } from "@/shared/system/localizations";
import { inject, reactive } from "vue";
import { Performer, Dispatcher, Mutable, SharedStore, Store } from ".";
import { useRouter } from "vue-router";
import { Subscription } from "rxjs";
import { Actor } from "@/shared/service/application/actors";
import { Warranty } from "@/shared/service/domain/entities/warranty";


export interface WarrantyStore extends Store {
    warranties: Warranty[]
}
export interface WarrantyPerformer extends Performer<WarrantyStore> {
    readonly store: WarrantyStore;
    get: (context: GetWarrantyListScenes, actor: Actor) => void;
}

export function createWarrantyPerformer(dispatcher: Dispatcher): WarrantyPerformer {
    const t = inject(DICTIONARY_KEY) as Dictionary;
    const router = useRouter();

    const store = reactive<WarrantyStore>({
        warranties: []
    });

    const _store = store as Mutable<WarrantyStore>;

    return {
        store
        , get: (context: GetWarrantyListScenes, actor: Actor) => {
            const _shared = dispatcher.stores.shared as Mutable<SharedStore>;
            let subscription: Subscription | null = null;
            subscription = new GetWarrantyListUsecase(context)
                .interactedBy(actor, {
                    next: ([lastSceneContext, performedScenario]) => {
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
                    , complete: dispatcher.commonCompletionProcess
                });
        }
    };
}