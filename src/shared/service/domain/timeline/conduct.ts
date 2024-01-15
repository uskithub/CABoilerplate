import { Entity } from "@/shared/system/interfaces/architecture";
import { Observable } from "rxjs";
import dependencies from "../dependencies";
import { ChangedConduct } from "../interfaces/backend";

export const ConductTypes = {
    text: "text"
} as const;

export type ConductTypes = typeof ConductTypes[keyof typeof ConductTypes];


export type ConductProperties = {
    id: string;
    type: ConductTypes;
    from: string;
    to: string | null;
    mention: string[] | null;
    text: string | null;
    createdAt: Date;
};


export class Conduct implements Entity<ConductProperties> {
    static getObservavle(userId: string): Observable<ChangedConduct[]> {
        return dependencies.backend.conducts.getObservable(userId, [], [], false);
    }
}