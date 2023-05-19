import { Observable } from "rxjs";
import { Post } from "@api";
import dependencies from "../dependencies";

export interface Warranty {
    id: string;
}

export default {
    get: (): Observable<Post[]> => {
        return dependencies.backend.getWarranties();
    }
};