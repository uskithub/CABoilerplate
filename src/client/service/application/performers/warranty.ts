// service

// system
import { Dictionary, DICTIONARY_KEY } from "@/shared/system/localizations";
import { inject, reactive } from "vue";
import { Performer, Service, Mutable, SharedStore, Store } from ".";
import { useRouter } from "vue-router";
import { Actor } from "@/shared/service/application/actors";
import { Warranty } from "@/shared/service/domain/entities/warranty";
import { AuthorizedUser } from "@/shared/service/application/actors/authorizedUser";
import { Usecase } from "@/shared/service/application/usecases";
import { InteractResultType } from "robustive-ts";

export interface WarrantyStore extends Store {
    warranties: Warranty[]
}
export interface WarrantyPerformer extends Performer<WarrantyStore> {
    readonly store: WarrantyStore;
    get: (usecase: Usecase<"projectManagement", "getWarrantyList">, actor: Actor) => Promise<void>;
}

export function createWarrantyPerformer(service: Service): WarrantyPerformer {
    const t = inject(DICTIONARY_KEY) as Dictionary;
    const router = useRouter();

    const store = reactive<WarrantyStore>({
        warranties: []
    });

    const _store = store as Mutable<WarrantyStore>;

    return {
        store
        , get: (usecase: Usecase<"projectManagement", "getWarrantyList">, actor: Actor) :  Promise<void> => {
            const goals = AuthorizedUser.usecases.getWarrantyList.goals;
            const _shared = service.stores.shared as Mutable<SharedStore>;
            return usecase
                .interactedBy(actor)
                .then(result => {
                    if (result.type !== InteractResultType.success) {
                        return console.error("TODO", result);
                    }
                    const context = result.lastSceneContext;
                    
                    switch (context.scene) {
                    case goals.resultIsOneOrMoreThenServiceDisplaysResultOnWarrantyListView: {
                        console.log("OKKKKKK", context.warranties);
                        _store.warranties = context.warranties;
                        break;
                    }
                    case goals.resultIsZeroThenServiceDisplaysNoResultOnWarrantyListView: {
                        _store.warranties = [];
                        break;
                    }
                    }
                });
        }
    };
}