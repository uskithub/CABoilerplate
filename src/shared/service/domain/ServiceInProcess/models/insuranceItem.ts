import { InsuranceItem } from "@/shared/service/infrastructure/API";

// System
import { Observable } from "rxjs";
import dependencies from "../../dependencies";

export default {
    list: (): Observable<InsuranceItem[]|null> => {
        return dependencies.serviceInProcess.listInsuranceItems();
    }
};