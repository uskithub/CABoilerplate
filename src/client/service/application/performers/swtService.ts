import { Performer, Store } from ".";


// system
import { reactive } from "vue";

export type SwtServiceStore = Store

export interface SwtServicePerformer extends Performer<SwtServiceStore> {
    readonly store: SwtServiceStore;
    addInsuranceItem: (insuranceItem: InsuranceItem) => void;
}

export function createSwtServicPerformer(): SwtServicePerformer {
    const store = reactive<SwtServiceStore>({
    });

    return {
        store
    };
}