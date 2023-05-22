import { isBootScene } from "@usecases/nobody/boot";
import { InjectionKey, reactive } from "vue";
import { createApplicationPerformer } from "./application";
import { createUserPerformer } from "./user";
import type { UserStore } from "./user";
import { isSignUpScene } from "@usecases/nobody/signUp";
import { isSignInScene } from "@usecases/nobody/signIn";
import { isSignOutScene } from "@usecases/signedInUser/signOut";
import { Usecases } from "@/shared/service/application/usecases";
import { SignInStatus } from "@/shared/service/domain/interfaces/authenticator";
import { Actor } from "@/shared/service/application/actors";
import { isObservingUsersTasksScene } from "@usecases/service/observingUsersTasks";
import { Service } from "@/shared/service/application/actors/service";
import { isGetWarrantyListScene } from "@/shared/service/application/usecases/signedInUser/getWarrantyList";
import { createWarrantyPerformer} from "./warranty";
import { isListInsuranceItemsScene } from "@/shared/service/application/usecases/ServiceInProcess/signedInUser/listInsuranceItems";
import { createServiceInProcessPerformer } from "./serviceInProcess";

// System
import { ContextualizedScenes, Empty, Nobody } from "robustive-ts";
import { watch, WatchStopHandle } from "vue";
import { Log } from "@/shared/service/domain/analytics/log";

export type Mutable<Type> = {
    -readonly [Property in keyof Type]: Type[Property];
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Store { }
export interface Performer<T extends Store> { readonly store: T; }

type ImmutableActor = Readonly<Actor>;
type ImmutableUsecase = Readonly<Usecases>;

export interface SharedStore extends Store {
    readonly actor: ImmutableActor;
    readonly executingUsecase: ImmutableUsecase | null;
    readonly signInStatus: SignInStatus;
}

type Stores = {
    shared: SharedStore;
    user: UserStore;
};

export type Dispatcher = {
    stores: Stores;
    change: (actor: Actor) => void;
    commonCompletionProcess: () => void;
    dispatch: <T extends Record<keyof any, Empty>>(context: ContextualizedScenes<T>) => void;
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
            , user: {} as UserStore
        }
        , change(actor: Actor) {
            const _shared = shared as Mutable<SharedStore>;
            _shared.actor = actor;
        }
        , commonCompletionProcess: () => {
            const _shared = shared as Mutable<SharedStore>;
            _shared.executingUsecase = null;
        }
        , dispatch(context) {}
    } as Dispatcher;

    const performers = {
        application: createApplicationPerformer(dispatcher)
        , user: createUserPerformer(dispatcher)
        , warranty: createWarrantyPerformer(dispatcher)
        , serviceInProcess: createServiceInProcessPerformer(dispatcher)
    };

    dispatcher.stores.user = performers.user.store;

    dispatcher.dispatch = (context) => {
        const _shared = shared as Mutable<SharedStore>;
        const actor = shared.actor;

        new Log("dispatch", { context, actor: { actor: actor.constructor.name, user: actor.user }}).record();

        /* Nobody */
        if (isBootScene(context)) {
            console.info("[DISPATCH] Boot:", context);
            _shared.executingUsecase = { executing: context, startAt: new Date() };
            performers.application.boot(context, actor);
        } else if (isSignUpScene(context)) {
            console.info("[DISPATCH] SignUp", context);
            _shared.executingUsecase = { executing: context, startAt: new Date() };
            performers.user.signUp(context, actor);
        } else if (isSignInScene(context)) {
            console.info("[DISPATCH] SignIn", context);
            _shared.executingUsecase = { executing: context, startAt: new Date() };
            performers.user.signIn(context, actor);
        }

        /* Service */
        else if (isObservingUsersTasksScene(context)) {
            console.info("[DISPATCH] ObservingUsersTasks:", context);
            // 観測し続けるのでステータス管理しない
            // _shared.executingUsecase = { executing: context, startAt: new Date() };
            performers.user.observingUsersTasks(context, new Service());
        } 

        // 初回表示時対応
        // signInStatus が不明の場合、signInUserでないと実行できないUsecaseがエラーになるので、
        // ステータスが変わるのを監視し、その後実行し直す
        else if (shared.signInStatus === SignInStatus.unknown) {
            console.info("[DISPATCH] signInStatus が 不明のため、ユースケースの実行を保留します...");
            let stopHandle: WatchStopHandle|null = null;
            stopHandle = watch(() => shared.signInStatus, (newValue) => {
                if (newValue !== SignInStatus.unknown) {
                    console.log(`[DISPATCH] signInStatus が "${ newValue }" に変わったため、保留したユースケースを再開します...`);
                    dispatcher.dispatch(context);
                    stopHandle?.();
                }
            });
        }

        /* ServiceInProcess */
        else if (isListInsuranceItemsScene(context)) {
            console.info("[DISPATCH] ListInsuranceItem:", context);
            _shared.executingUsecase = { executing: context, startAt: new Date() };
            performers.serviceInProcess.list(context, actor);
        }

        /* SignedInUser */
        else if (isSignOutScene(context)) {
            console.info("[DISPATCH] SignOut", context);
            _shared.executingUsecase = { executing: context, startAt: new Date() };
            performers.user.signOut(context, actor);
        } else if (isGetWarrantyListScene(context)) {
            console.info("[DISPATCH] GetWarrantyList", context);
            _shared.executingUsecase = { executing: context, startAt: new Date() };
            performers.warranty.get(context, actor);
        } else {
            throw new Error(`dispatch先が定義されていません: ${context.scene as string}`);
        }
    };

    return dispatcher;
}

export const DISPATCHER_KEY = Symbol("Dispatcher") as InjectionKey<Dispatcher>;