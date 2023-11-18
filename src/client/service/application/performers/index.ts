import { InjectionKey, reactive } from "vue";
import { ApplicationStore, createApplicationPerformer } from "./application";
import { createAuthenticationPerformer } from "./authentication";
import type { AuthenticationStore } from "./authentication";
import { SignInStatus, SignInStatuses } from "@/shared/service/domain/interfaces/authenticator";
import { Actor } from "@/shared/service/application/actors";
import { Service } from "@/shared/service/application/actors/service";
import { createWarrantyPerformer } from "./warranty";
import { createServiceInProcessPerformer } from "./serviceInProcess";

// System
import { Nobody } from "robustive-ts";
import { watch, WatchStopHandle } from "vue";
import { Log } from "@/shared/service/domain/analytics/log";
import { createChatPerformer } from "./chat";
import { Usecases, UsecaseLog } from "@/shared/service/application/usecases";
import { Subscription } from "rxjs";
import { Application } from "@/shared/service/domain/application/application";
import { createProjectManagementPerformer, ProjectManagementStore } from "./projectManagement";

export type Mutable<Type> = {
    -readonly [Property in keyof Type]: Type[Property];
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Store { }
export interface Performer<T extends Store> { readonly store: T; }

type ImmutableActor = Readonly<Actor>;
type ImmutableUsecaseLog = Readonly<UsecaseLog>;

export interface SharedStore extends Store {
    readonly actor: ImmutableActor;
    readonly executingUsecase: ImmutableUsecaseLog | null;
    readonly signInStatus: SignInStatus;
}

type Stores = {
    shared: SharedStore;
    application: ApplicationStore;
    authentication: AuthenticationStore;
    projectManagement: ProjectManagementStore
};

export type Dispatcher = {
    stores: Stores;
    change: (actor: Actor) => void;
    commonCompletionProcess: (subscription: Subscription | null) => void;
    dispatch: (usecase: Usecases) => Promise<Subscription | void>;
    // accountViewModel: (shared: SharedStore) => HomeViewModel;
    // createSignInViewModel: (shared: SharedStore) => SignInViewModel;
    // createSignUpViewModel: (shared: SharedStore) => SignUpViewModel;
}

// Performerをどういう単位で作るかを再考する
// ✕ 画面単位
// ◯ DoaminModelのような単位

export function createDispatcher(): Dispatcher {
    const shared = reactive<SharedStore>({
        actor: new Nobody()
        , executingUsecase: null
        , signInStatus: SignInStatuses.unknown()
    });

    const dispatcher = {
        stores: {
            shared
            , application: {} as ApplicationStore
            , authentication: {} as AuthenticationStore
            , projectManagement: {} as ProjectManagementStore
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
        , dispatch() { return Promise.resolve(); }
    } as Dispatcher;

    const performers = {
        application: createApplicationPerformer(dispatcher)
        , authentication: createAuthenticationPerformer(dispatcher)
        , warranty: createWarrantyPerformer(dispatcher)
        , serviceInProcess: createServiceInProcessPerformer(dispatcher)
        , chat: createChatPerformer(dispatcher)
        , projectManagement: createProjectManagementPerformer(dispatcher)
    };

    dispatcher.stores.application = performers.application.store;
    dispatcher.stores.authentication = performers.authentication.store;
    dispatcher.stores.projectManagement = performers.projectManagement.store;

    dispatcher.dispatch = (usecase: Usecases): Promise<Subscription | void> => {
        const _shared = shared as Mutable<SharedStore>;
        const actor = shared.actor;
        // new Log("dispatch", { context, actor: { actor: actor.constructor.name, user: actor.user } }).record();

        switch (usecase.name) {
        /* Nobody */
        case "boot": {
            console.info("[DISPATCH] Boot:", usecase);
            _shared.executingUsecase = { executing: usecase.name, startAt: new Date() };
            return performers.application.boot(usecase, actor);
        }
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

        _shared.executingUsecase = { executing: usecase.name, startAt: new Date() };

        switch (usecase.name) {
        /* Nobody */
        case "signUp": {
            console.info("[DISPATCH] SignUp", usecase);
            _shared.executingUsecase = { executing: usecase.name, startAt: new Date() };
            return performers.authentication.signUp(usecase, actor);
        }
        case "signIn": {
            console.info("[DISPATCH] SignIn", usecase);
            _shared.executingUsecase = { executing: usecase.name, startAt: new Date() };
            return performers.authentication.signIn(usecase, actor);
        }
    
        /* Service */
        case "observingUsersTasks": {
            console.info("[DISPATCH] ObservingUsersTasks:", usecase);
            // 観測し続けるのでステータス管理しない
            // _shared.executingUsecase = { executing: usecase.name, startAt: new Date() };
            return performers.application.observingUsersTasks(usecase, new Service());
        }

        case "observingUsersProjects": {
            console.info("[DISPATCH] observingUsersProjects:", usecase);
            return performers.application.observingUsersProjects(usecase, new Service());
        }
        
        /* SignedInUser */
        case "listInsuranceItems": {
            console.info("[DISPATCH] ListInsuranceItem:", usecase);
            return performers.serviceInProcess.list(usecase, actor);
        }
        case "signOut": {
            console.info("[DISPATCH] SignOut", usecase);
            return performers.authentication.signOut(usecase, actor);
        }
        case "getWarrantyList": {
            console.info("[DISPATCH] GetWarrantyList", usecase);
            return performers.warranty.get(usecase, actor);
        }
        case "consult": {
            console.info("[DISPATCH] Consult", usecase);
            return performers.chat.consult(usecase, actor);
        }
        case "observingProject": {
            console.info("[DISPATCH] ObservingProject", usecase);
            return performers.chat.consult(usecase, actor);
        }
        default: {
            throw new Error(`dispatch先が定義されていません: ${ usecase.name }`);
        }
        }
    };
    
    return dispatcher;
}

export const DISPATCHER_KEY = Symbol("Dispatcher") as InjectionKey<Dispatcher>;