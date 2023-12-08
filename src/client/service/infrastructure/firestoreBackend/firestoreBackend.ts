import { Backend, ProjectFunctions, TaskFunctions, UserFunctions } from "@/shared/service/domain/interfaces/backend";
import { Firestore } from "firebase/firestore";
import { createUserFunctions } from "./users";
import { createTaskFunctions } from "./tasks";
import { createProjectFunctions } from "./projects";

export const CollectionType = {
    users : "users"
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

export class FirestoreBackend implements Backend {
    #db: Firestore;
    #unsubscribers: Array<() => void>; // TODO: サインアウト時に unscribe する

    users: UserFunctions;
    tasks: TaskFunctions;
    projects: ProjectFunctions;

    constructor(db: Firestore) {
        this.#db = db;
        this.#unsubscribers = new Array<() => void>();
        this.users = createUserFunctions(db);
        this.tasks = createTaskFunctions(db, this.#unsubscribers);
        this.projects = createProjectFunctions(db, this.#unsubscribers);
    }
}