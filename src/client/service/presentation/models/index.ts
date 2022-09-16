import { Boot, isBootScene } from "@/shared/service/application/usecases/boot";
import { User } from "@/shared/service/domain/models/user";
import { Empty, UsecaseScenario } from "robustive-ts";
import { InjectionKey, reactive } from "vue";
import { createUserModel, UserModel } from "./user";
import { isSignUpScene } from "@/shared/service/application/usecases/signUp";
import { isSignInScene } from "@/shared/service/application/usecases/signIn";
import { isSignOutScene } from "@/shared/service/application/usecases/signOut";
import { Usecases } from "@/shared/service/application/usecases";

export type Mutable<Type> = {
  -readonly [Property in keyof Type]: Type[Property];
};

export interface LocalStore {}
export interface ViewModel<T extends LocalStore> { readonly store: T; }

type ImmutableUser = Readonly<User>;
type ImmutableUsecase = Readonly<Usecases>;
export interface SharedStore {
    readonly user: ImmutableUser|null;
    readonly executingUsecase: ImmutableUsecase|null;
}

export type ViewModels = {
    shared: SharedStore;
    user: UserModel;
    dispatch: <T extends Record<keyof any, Empty>, S extends UsecaseScenario<T>>(context: S) => void;
    // accountViewModel: (shared: SharedStore) => HomeViewModel;
    // createSignInViewModel: (shared: SharedStore) => SignInViewModel;
    // createSignUpViewModel: (shared: SharedStore) => SignUpViewModel;
}

// ViewModelをどういう単位で作るかを再考する
// ✕ 画面単位
// ◯ DoaminModelのような単位

export function createViewModels(): ViewModels {
    const shared = reactive<SharedStore>({
        user: null
        , executingUsecase: null
    });

    const user = createUserModel(shared);
    const _shared = shared as Mutable<SharedStore>;

    return {
        shared
        , user
        , dispatch(context) {
            if (isBootScene(context)) {
                console.info("[DISPATCH] Boot:", context);
                _shared.executingUsecase = { executing: context, startAt: new Date() };
                user.boot(context);
            } else if (isSignUpScene(context)) {
                console.info("[DISPATCH] SignUp", context);
                _shared.executingUsecase = { executing: context, startAt: new Date() };
                user.signUp(context);
            } else if (isSignInScene(context)) {
                console.info("[DISPATCH] SignIn", context);
                _shared.executingUsecase = { executing: context, startAt: new Date() };
                user.signIn(context);
            } else if (isSignOutScene(context)) {
                console.info("[DISPATCH] SignOut", context);
                _shared.executingUsecase = { executing: context, startAt: new Date() };
                user.signOut(context);
            } else {
                throw new Error(`dispatch先が定義されていません: ${ context.scene }`);
            }
        }
    };
}

export const VIEW_MODELS_KEY = Symbol("ViewModels") as InjectionKey<ViewModels>;
