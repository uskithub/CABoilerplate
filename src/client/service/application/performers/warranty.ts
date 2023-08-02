// service

// system
import { Dictionary, DICTIONARY_KEY } from "@/shared/system/localizations";
import { inject, reactive } from "vue";
import { Performer, Dispatcher, Mutable, SharedStore, Store } from ".";
import { useRouter } from "vue-router";
import { Subscription } from "rxjs";
import { Actor } from "@/shared/service/application/actors";
import { Warranty } from "@/shared/service/domain/entities/warranty";
import { SignInUserUsecases } from "@/shared/service/application/usecases/signedInUser";
import { Usecase } from "@/shared/service/application/usecases";

export interface WarrantyStore extends Store {
    warranties: Warranty[]
}
export interface WarrantyPerformer extends Performer<WarrantyStore> {
    readonly store: WarrantyStore;
    get: (usecase: Usecase<"getWarrantyList">, actor: Actor) => void;
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
        , get: (usecase: Usecase<"getWarrantyList">, actor: Actor) => {
            const _u = SignInUserUsecases.getWarrantyList;
            const _shared = dispatcher.stores.shared as Mutable<SharedStore>;
            let subscription: Subscription | null = null;
            subscription = usecase
                .interactedBy(actor, {
                    next: ([lastSceneContext]) => {
                        switch (lastSceneContext.scene) {
                        case _u.goals.resultIsOneOrMoreThenServiceDisplaysResultOnWarrantyListView:
                            console.log("OKKKKKK", lastSceneContext.warranties);
                            _store.warranties = lastSceneContext.warranties;
                            break;
                        case _u.goals.resultIsZeroThenServiceDisplaysNoResultOnWarrantyListView:
                            _store.warranties = [];
                            break;
                        }
                    }
                    , complete: dispatcher.commonCompletionProcess
                });
        }
    };
}