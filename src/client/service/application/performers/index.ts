import { InjectionKey, reactive } from "vue";
import { createApplicationPerformer } from "./application";
import { createAuthenticationPerformer } from "./authentication";
import type { AuthenticationStore } from "./authentication";
import { SignInStatus } from "@/shared/service/domain/interfaces/authenticator";
import { Actor } from "@/shared/service/application/actors";
import { Service } from "@/shared/service/application/actors/service";
import { createWarrantyPerformer } from "./warranty";
import { createServiceInProcessPerformer } from "./serviceInProcess";

// System
import { Nobody } from "robustive-ts";
import { watch, WatchStopHandle } from "vue";
import { Log } from "@/shared/service/domain/analytics/log";
import { createChatPerformer } from "./chat";
import type { Usecase, Usecases } from "robustive-ts/types/usecase";
import { UsecaseDefinitions } from "@/shared/service/application/usecases";

export type Mutable<Type> = {
    -readonly [Property in keyof Type]: Type[Property];
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Store { }
export interface Performer<T extends Store> { readonly store: T; }

type ImmutableActor = Readonly<Actor>;
type ImmutableUsecase = Readonly<Usecases<UsecaseDefinitions>>;

export interface SharedStore extends Store {
    readonly actor: ImmutableActor;
    readonly executingUsecase: ImmutableUsecase | null;
    readonly signInStatus: SignInStatus;
}

type Stores = {
    shared: SharedStore;
    authentication: AuthenticationStore;
};

export type Dispatcher = {
    stores: Stores;
    change: (actor: Actor) => void;
    commonCompletionProcess: () => void;
    dispatch: (usecase: Usecases<UsecaseDefinitions>) => void;
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
        , signInStatus: SignInStatus.unknown
    });

    const dispatcher = {
        stores: {
            shared
            , authentication: {} as AuthenticationStore
        }
        , change(actor: Actor) {
            const _shared = shared as Mutable<SharedStore>;
            _shared.actor = actor;
        }
        , commonCompletionProcess: () => {
            const _shared = shared as Mutable<SharedStore>;
            _shared.executingUsecase = null;
        }
        , dispatch(usecase: Usecases<UsecaseDefinitions>) {}
    } as Dispatcher;

    const performers = {
        application: createApplicationPerformer(dispatcher)
        , authentication: createAuthenticationPerformer(dispatcher)
        , warranty: createWarrantyPerformer(dispatcher)
        , serviceInProcess: createServiceInProcessPerformer(dispatcher)
        , chat: createChatPerformer(dispatcher)
    };

    dispatcher.stores.authentication = performers.authentication.store;

    dispatcher.dispatch = (usecase: Usecases<UsecaseDefinitions>) => {
        const _shared = shared as Mutable<SharedStore>;
        const actor = shared.actor;
        // new Log("dispatch", { context, actor: { actor: actor.constructor.name, user: actor.user } }).record();

        console.log("###", usecase);

        switch (usecase.name) {
        /* Nobody */
        case "boot": {
            console.info("[DISPATCH] Boot:", usecase.from);
            // _shared.executingUsecase = { executing: usecase.from.context, startAt: new Date() };
            performers.application.boot(usecase.from, actor);
            return;
        }
        case "signUp": {
            console.info("[DISPATCH] SignUp", usecase.from);
            // _shared.executingUsecase = { executing: usecase.from.context, startAt: new Date() };
            performers.authentication.signUp(usecase.from, actor);
            return;
        }
        case "signIn": {
            console.info("[DISPATCH] SignIn", usecase.from);
            // _shared.executingUsecase = { executing: usecase.from.context, startAt: new Date() };
            performers.authentication.signIn(usecase.from, actor);
            return;
        }

        /* Service */
        case "observingUsersTasks": {
            console.info("[DISPATCH] ObservingUsersTasks:", usecase.from);
            // 観測し続けるのでステータス管理しない
            // _shared.executingUsecase = { executing: context, startAt: new Date() };
            performers.authentication.observingUsersTasks(usecase.from, new Service());
            return;
        }
        }

        // 初回表示時対応
        // signInStatus が不明の場合、signInUserでないと実行できないUsecaseがエラーになるので、
        // ステータスが変わるのを監視し、その後実行し直す
        if (shared.signInStatus === SignInStatus.unknown) {
            console.info("[DISPATCH] signInStatus が 不明のため、ユースケースの実行を保留します...");
            let stopHandle: WatchStopHandle | null = null;
            stopHandle = watch(() => shared.signInStatus, (newValue) => {
                console.log("%%%%%", newValue);
                if (newValue !== SignInStatus.unknown) {
                    console.log(`[DISPATCH] signInStatus が "${ newValue }" に変わったため、保留したユースケースを再開します...`);
                    dispatcher.dispatch(usecase);
                    stopHandle?.();
                }
            });
        }

        /* SignedInUser */
        switch (usecase.name) {
        case "listInsuranceItems": {
            console.info("[DISPATCH] ListInsuranceItem:", usecase.from);
            // _shared.executingUsecase = { executing: usecase.from.context, startAt: new Date() };
            performers.serviceInProcess.list(usecase.from, actor);
            break;
        }
        case "signOut": {
            console.info("[DISPATCH] SignOut", usecase.from);
            // _shared.executingUsecase = { executing: usecase.from.context, startAt: new Date() };
            performers.authentication.signOut(usecase.from, actor);
            break;
        }
        case "getWarrantyList": {
            console.info("[DISPATCH] GetWarrantyList", usecase.from);
            // _shared.executingUsecase = { executing: usecase.from.context, startAt: new Date() };
            performers.warranty.get(usecase.from, actor);
            break;
        }
        case "consult": {
            console.info("[DISPATCH] Consult", usecase.from);
            // _shared.executingUsecase = { executing: usecase.from.context, startAt: new Date() };
            performers.chat.consult(usecase.from, actor);
            break;
        }
        // default: {
        //     throw new Error(`dispatch先が定義されていません: ${ usecase.name }`);
        // }
        }
    };
    
    return dispatcher;
}

export const DISPATCHER_KEY = Symbol("Dispatcher") as InjectionKey<Dispatcher>;