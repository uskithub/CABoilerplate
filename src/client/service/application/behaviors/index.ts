import { isBootScene } from "@usecases/nobody/boot";
import { Empty, Nobody, UsecaseScenario } from "robustive-ts";
import { InjectionKey, reactive } from "vue";
import { createApplicationBehavior } from "./application";
import { createUserBehavior } from "./user";
import type { UserStore } from "./user";
import { isSignUpScene } from "@usecases/nobody/signUp";
import { isSignInScene } from "@usecases/nobody/signIn";
import { isSignOutScene } from "@usecases/signedInUser/signOut";
import { Usecases } from "@/shared/service/application/usecases";
import { SignInStatus } from "@/shared/service/domain/interfaces/authenticator";
import { Actor } from "@/shared/service/application/actors";
import { isObservingUsersTasksScene } from "@usecases/service/observingUsersTasks";

export type Mutable<Type> = {
    -readonly [Property in keyof Type]: Type[Property];
};

export interface Store { }
export interface Behavior<T extends Store> { readonly store: T; }

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

export type BehaviorController = {
    stores: Stores;
    dispatch: <T extends Record<keyof any, Empty>, S extends UsecaseScenario<T>>(context: S) => void;
    // accountViewModel: (shared: SharedStore) => HomeViewModel;
    // createSignInViewModel: (shared: SharedStore) => SignInViewModel;
    // createSignUpViewModel: (shared: SharedStore) => SignUpViewModel;
}

// Behaviorをどういう単位で作るかを再考する
// ✕ 画面単位
// ◯ DoaminModelのような単位

export function createBehaviorController(): BehaviorController {
    const shared = reactive<SharedStore>({
        actor: new Nobody()
        , executingUsecase: null
        , signInStatus: SignInStatus.unknown
    });

    const controller = {
        stores: {
            shared
            , user: {} as UserStore
        }
        , dispatch(context) {}
    } as BehaviorController;

    const behaviors = {
        application: createApplicationBehavior(controller)
        , user: createUserBehavior(controller)
    };

    controller.stores.user = behaviors.user.store;

    controller.dispatch = (context) => {
        const _shared = shared as Mutable<SharedStore>;

        /* Nobody */
        if (isBootScene(context)) {
            console.info("[DISPATCH] Boot:", context);
            _shared.executingUsecase = { executing: context, startAt: new Date() };
            behaviors.application.boot(context);
        } else if (isSignUpScene(context)) {
            console.info("[DISPATCH] SignUp", context);
            _shared.executingUsecase = { executing: context, startAt: new Date() };
            behaviors.user.signUp(context);
        } else if (isSignInScene(context)) {
            console.info("[DISPATCH] SignIn", context);
            _shared.executingUsecase = { executing: context, startAt: new Date() };
            behaviors.user.signIn(context);
        }

        /* SignedInUser */
        else if (isSignOutScene(context)) {
            console.info("[DISPATCH] SignOut", context);
            _shared.executingUsecase = { executing: context, startAt: new Date() };
            behaviors.user.signOut(context);
        }

        /* Service */
        else if (isObservingUsersTasksScene(context)) {
            console.info("[DISPATCH] ObservingUsersTasks:", context);
            _shared.executingUsecase = { executing: context, startAt: new Date() };
            behaviors.user.observingUsersTasks(context);
        } else {
            throw new Error(`dispatch先が定義されていません: ${context.scene as string}`);
        }
    };

    return controller;
}

export const BEHAVIOR_CONTROLLER_KEY = Symbol("BehaviorController") as InjectionKey<BehaviorController>;
