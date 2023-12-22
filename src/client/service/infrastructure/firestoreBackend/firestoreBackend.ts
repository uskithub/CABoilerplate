import { Backend, OrganizationFunctions, ProjectFunctions, TaskFunctions, UserFunctions } from "@/shared/service/domain/interfaces/backend";
import { Firestore } from "firebase/firestore";
import { createUserFunctions } from "./users";
import { createTaskFunctions } from "./tasks";
import { createProjectFunctions } from "./projects";
import { createOrganizationFunctions } from "./organizations";

export const CollectionType = {
    users : "users"
    , organizations : "organizations"
    , rooms : "rooms"
    , tasks : "tasks"
    , templates : "templates"
    , logs : "logs"
    , deeds : "deeds"
    , invitations : "invitations"
    , notifications : "notifications"
    , doings : "doings"
    , messages : "messages"
} as const;

export type CollectionType = typeof CollectionType[keyof typeof CollectionType];

export const MAX_ID = "zzzzzzzzzzzzzzzzzzzz"; // "1" < "Z" < "z"

/**
 * https://github.com/googleapis/nodejs-firestore/blob/main/dev/src/util.ts#L57
 */
export function autoId(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let autoId = "";
    while (autoId.length < 20) {
        const bytes = randomBytes(40);
        bytes.forEach(b => {
        // Length of `chars` is 62. We only take bytes between 0 and 62*4-1
        // (both inclusive). The value is then evenly mapped to indices of `char`
        // via a modulo operation.
            const maxValue = 62 * 4 - 1;
            if (autoId.length < 20 && b <= maxValue) {
                autoId += chars.charAt(b % 62);
            }
        });
    }
    return autoId;
}

export class FirestoreBackend implements Backend {
    #db: Firestore;
    #unsubscribers: Array<() => void>; // TODO: サインアウト時に unscribe する

    users: UserFunctions;
    organizations: OrganizationFunctions;
    tasks: TaskFunctions;
    projects: ProjectFunctions;

    constructor(db: Firestore) {
        this.#db = db;
        this.#unsubscribers = new Array<() => void>();
        this.users = createUserFunctions(db);
        this.organizations = createOrganizationFunctions(db);
        this.tasks = createTaskFunctions(db, this.#unsubscribers);
        this.projects = createProjectFunctions(db, this.#unsubscribers);
    }
}