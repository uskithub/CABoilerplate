// Service
import { CreateInsuranceItemInput, InsuranceItem } from "@/shared/service/infrastructure/API";

// System
import { Observable } from "rxjs";

export interface ServiceInProcessBackend {
    addInsuranceItem: (insuranceItem: CreateInsuranceItemInput) => Observable<InsuranceItem|null>;
    listInsuranceItems: () => Observable<InsuranceItem[]|null>;
}