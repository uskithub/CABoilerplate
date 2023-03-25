import { isBootScene } from "@/shared/service/application/usecases/boot";
import { Empty, Nobody, UsecaseScenario } from "robustive-ts";
import { InjectionKey, reactive } from "vue";
import { createApplicationBehavior } from "./application";
import { createUserBehavior } from "./user";
import type { UserStore } from "./user";
import { isSignUpScene } from "@/shared/service/application/usecases/signUp";
import { isSignInScene } from "@/shared/service/application/usecases/signIn";
import { isSignOutScene } from "@/shared/service/application/usecases/signOut";
import { Usecases } from "@/shared/service/application/usecases";
import { SignInStatus } from "@/shared/service/domain/interfaces/authenticator";
import { SignedInUser } from "../actors/signedInUser";
import { Actor } from "../actors";

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
    const _shared = shared as Mutable<SharedStore>;

    const behaviors = {
        application: createApplicationBehavior(shared)
        , user: createUserBehavior(shared)
    };

    return {
        stores: {
            shared
            , user: behaviors.user.store
        }
        , dispatch(context) {
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
            } else if (isSignOutScene(context)) {
                console.info("[DISPATCH] SignOut", context);
                _shared.executingUsecase = { executing: context, startAt: new Date() };
                behaviors.user.signOut(context);
            } else {
                throw new Error(`dispatch先が定義されていません: ${context.scene}`);
            }
        }
    };
}

export const BEHAVIOR_CONTROLLER_KEY = Symbol("BehaviorController") as InjectionKey<BehaviorController>;
