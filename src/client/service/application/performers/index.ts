import { ApplicationStore, createApplicationPerformer } from "./application";
import { createAuthenticationPerformer } from "./authentication";
import type { AuthenticationStore } from "./authentication";
import { Actor } from "@/shared/service/application/actors";
import { SignInStatus, SignInStatuses } from "@/shared/service/domain/interfaces/authenticator";
import { createTimelinePerformer } from "./timeline";
import { Log } from "@/shared/service/domain/analytics/log";
import { Usecases, UsecaseLog, Requirements, UsecasesOf, R } from "@/shared/service/application/usecases";
import { createProjectManagementPerformer, ProjectManagementStore } from "./projectManagement";

// System
import { InjectionKey, reactive, watch, WatchStopHandle } from "vue";
import { RouteLocationRaw, Router } from "vue-router";
import { Subscription } from "rxjs";
import { Nobody } from "@/shared/service/application/actors/nobody";

export type Mutable<Type> = {
    -readonly [Property in keyof Type]: Type[Property];
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Store {}
export interface Performer<D extends keyof Requirements, T extends Store> {
    readonly store: T;
    dispatch: (usecase: UsecasesOf<D>, actor: Actor, dispatcher: Dispatcher) => Promise<Subscription | void>;
}

type ImmutableActor = Readonly<Actor>;
type ImmutableUsecaseLog = Readonly<UsecaseLog>;

export interface SharedStore extends Store {
    readonly actor: ImmutableActor;
    readonly executingUsecase: ImmutableUsecaseLog | null;
    readonly signInStatus: SignInStatus;
    readonly currentRouteLocation: RouteLocationRaw;
    readonly isLoading: boolean;
}

export type Dispatcher = {
    stores: {
        shared: SharedStore;
        application: ApplicationStore;
        authentication: AuthenticationStore;
        projectManagement: ProjectManagementStore;
    };
    change: (actor: Actor) => void;
    routingTo: (path: string) => void;
    commonCompletionProcess: (subscription: Subscription | null) => void;
    dispatch: (usecase: Usecases, actor?: Actor) => Promise<Subscription | void>;
};

export function createDispatcher(router: Router): Dispatcher {
    const initialPath = router.currentRoute.value.path;
    const shared = reactive<SharedStore>({
        actor: new Nobody()
        , executingUsecase: null
        , signInStatus: SignInStatuses.unknown()
        , currentRouteLocation: initialPath
        , isLoading: true
    });

    watch(() => shared.currentRouteLocation, (newValue, oldValue) => {
        console.log("★☆★☆★ RouteLocation:", oldValue, "--->", newValue);
        router.replace(newValue)
            .finally(() => {
                const _shared = shared as Mutable<SharedStore>;
                _shared.isLoading = false;
            });
    });

    const performers = {
        application: createApplicationPerformer()
        , authentication: createAuthenticationPerformer()
        , projectManagement: createProjectManagementPerformer()
        , timeline: createTimelinePerformer()
    };
    
    const dispatcher = {
        stores: {
            shared
            , application: performers.application.store
            , authentication: performers.authentication.store
            , projectManagement: performers.projectManagement.store
        }
        , change: (actor: Actor) => {
            const _shared = shared as Mutable<SharedStore>;
            _shared.actor = actor;
            console.log("actor changed: ", actor);
        }
        , routingTo: (path: string) => {
            const _shared = shared as Mutable<SharedStore>;
            _shared.currentRouteLocation = path;
            _shared.isLoading = false;
        }
        , commonCompletionProcess: (subscription: Subscription | null) => {
            subscription?.unsubscribe();
            const _shared = shared as Mutable<SharedStore>;
            _shared.executingUsecase = null;
        }
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        , dispatch: (usecase: Usecases, actor?: Actor): Promise<Subscription | void> => {
            const _shared = shared as Mutable<SharedStore>;
            const _actor = actor || shared.actor;
    
            console.info(`[DISPATCH] ${ usecase.domain }.${ usecase.name }.${ usecase.course }.${ usecase.scene } (${ usecase.id })` );
            _shared.executingUsecase = { id: usecase.id, executing: { domain: usecase.domain, usecase: usecase.name }, startAt: new Date() };
    
            // new Log("dispatch", { context, actor: { actor: actor.constructor.name, user: actor.user } }).record();
            if (usecase.domain === R.keys.application && usecase.name === R.application.keys.boot) {
                return performers.application.dispatch(usecase, _actor, dispatcher)
                    .finally(() => dispatcher.commonCompletionProcess(null));
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
            
            return Promise.resolve()
                .then(() => {
                    switch (usecase.domain) {
                    case R.keys.authentication: {
                        return performers.authentication.dispatch(usecase, _actor, dispatcher);
                    }
                    case R.keys.projectManagement: {
                        return performers.projectManagement.dispatch(usecase, _actor, dispatcher);
                    }
                    case R.keys.timeline: {
                        return performers.timeline.dispatch(usecase, _actor, dispatcher);
                    }
                    default: {
                        console.warn("未実装ドメインのユースケースです: ", usecase);
                    }
                    }
                })
                .finally(() => dispatcher.commonCompletionProcess(null));
        }
    } as Dispatcher;

    return dispatcher;
}

export const DISPATCHER_KEY = Symbol("Dispatcher") as InjectionKey<Dispatcher>;