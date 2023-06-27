import { Observable, map } from "rxjs";
import dependencies from "../dependencies";

export interface Warranty {
    id: string;
}

export default {
    get: (): Observable<Warranty[]> => {
        return dependencies.backend.getWarranties()
            .pipe(
                map((warranties) => {
                    if (warranties === null) {
                        return [] as Warranty[];
                    }
                    return warranties;
                })
            );
    }
};