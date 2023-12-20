import { Entity } from "@/shared/system/interfaces/architecture";
import dependencies from "../dependencies";
import { Account } from "./user";

export type OrganizationProperties = {
    id: string;
    domain: string | null;
    ownerIds: string[];
    administratorIds: string[];
    memberIds: string[];
    collaboratorIds: string[];
    createdAt: Date;
};

export class Organization implements Entity<OrganizationProperties> {
    
    static get(domain: string): Promise<OrganizationProperties | null> {
        return dependencies.backend.organizations.get(domain);
    }

    static create(domain: string, owner: Account): Promise<OrganizationProperties> {
        return dependencies.backend.organizations.create(domain, owner.id);
    }
}