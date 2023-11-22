import { InjectionKey, reactive } from "vue";
import { ApplicationStore, createApplicationPerformer } from "./application";
import { createAuthenticationPerformer } from "./authentication";
import type { AuthenticationStore } from "./authentication";
import { SignInStatus, SignInStatuses } from "@/shared/service/domain/interfaces/authenticator";
import { Actor } from "@/shared/service/application/actors";
import { createWarrantyPerformer } from "./warranty";
import { createServiceInProcessPerformer } from "./serviceInProcess";

// System
import { Nobody } from "robustive-ts";
import { watch, WatchStopHandle } from "vue";
import { Log } from "@/shared/service/domain/analytics/log";
import { createChatPerformer } from "./chat";
import { Usecases, UsecaseLog, Requirements, UsecasesOf } from "@/shared/service/application/usecases";
import { Subscription } from "rxjs";
import { createProjectManagementPerformer, ProjectManagementStore } from "./projectManagement";

export type Mutable<Type> = {
    -readonly [Property in keyof Type]: Type[Property];
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Store { }
export interface Performer<D extends keyof Requirements, T extends Store> {
    readonly store: T;
    dispatch: (usecase: UsecasesOf<D>, actor: Actor) => Promise<Subscription | void>;
}

type ImmutableActor = Readonly<Actor>;
type ImmutableUsecaseLog = Readonly<UsecaseLog>;

export interface SharedStore extends Store {
    readonly actor: ImmutableActor;
    readonly executingUsecase: ImmutableUsecaseLog | null;
    readonly signInStatus: SignInStatus;
}

export type Dispatcher = {
    stores: {
        shared: SharedStore;
        application: ApplicationStore;
        authentication: AuthenticationStore;
        projectManagement: ProjectManagementStore
    };
    change: (actor: Actor) => void;
    commonCompletionProcess: (subscription: Subscription | null) => void;
    // add<D extends keyof Requirements, S extends Store>(performer: Performer<D, S>): void;
    dispatch: (usecase: Usecases) => Promise<Subscription | void>;
};

export function createDispatcher(): Dispatcher {
    const shared = reactive<SharedStore>({
        actor: new Nobody()
        , executingUsecase: null
        , signInStatus: SignInStatuses.unknown()
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const performers = {
        application: createApplicationPerformer()
        , authentication: createAuthenticationPerformer()
        , projectManagement: createProjectManagementPerformer()
    };
    
    const dispatcher = {
        stores: {
            shared
            , application: performers.application.store
            , authentication: performers.authentication.store
            , projectManagement: performers.projectManagement.store
        }
        , change(actor: Actor) {
            const _shared = shared as Mutable<SharedStore>;
            _shared.actor = actor;
            console.log("actor changed: ", actor);
        }
        , commonCompletionProcess: (subscription: Subscription | null) => {
            subscription?.unsubscribe();
            const _shared = shared as Mutable<SharedStore>;
            _shared.executingUsecase = null;
        }
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        , dispatch(usecase: Usecases): Promise<Subscription | void> {
            const _shared = shared as Mutable<SharedStore>;
            const actor = shared.actor;
    
            console.info(`[DISPATCH] ${ usecase.domain }.${ usecase.name }` );
            _shared.executingUsecase = { executing: { domain: usecase.domain, usecase: usecase.name }, startAt: new Date() };
    
            // new Log("dispatch", { context, actor: { actor: actor.constructor.name, user: actor.user } }).record();
            if (usecase.domain === "application" && usecase.name === "boot") {
                return performers.application.dispatch(usecase, actor);
            }
    
            // 初回表示時対応
            // signInStatus が不明の場合、signInUserでないと実行できないUsecaseがエラーになるので、
            // ステータスが変わるのを監視し、その後実行し直す
            if (shared.signInStatus.case === SignInStatus.unknown) {
                console.info("[DISPATCH] signInStatus が 不明のため、ユースケースの実行を保留します...");
                let stopHandle: WatchStopHandle | null = null;
                return new Promise<void>((resolve) => {
                    stopHandle = watch(() => shared.signInStatus, (newValue) => {
                        if (newValue.case !== SignInStatus.unknown) {
                            console.log(`[DISPATCH] signInStatus が "${ newValue.case as string }" に変わったため、保留したユースケースを再開します...`);
                            resolve();
                        }
                    });
                })
                    .then(() => {
                        stopHandle?.();
                        return dispatcher.dispatch(usecase);
                    });
            }
            
            switch (usecase.domain) {
            case "authentication": {
                return performers.authentication.dispatch(usecase, actor);
            }
            case "projectManagement": {
                return performers.projectManagement.dispatch(usecase, actor);
            }
            }
            // return performers[usecase.domain].dispatch(usecase, actor);
        }
    } as Dispatcher;

    return dispatcher;
}

export const DISPATCHER_KEY = Symbol("Dispatcher") as InjectionKey<Dispatcher>;