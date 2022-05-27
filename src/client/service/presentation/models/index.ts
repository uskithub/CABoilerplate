import { Boot, isBootScene } from "@/shared/service/application/usecases/boot";
import { User } from "@/shared/service/domain/models/user";
import { Empty, UsecaseScenario } from "robustive-ts";
import { InjectionKey, reactive } from "vue";
import { createUserModel, UserModel } from "./user";
import { isSignUpScene } from "@/shared/service/application/usecases/signUp";
import { isSignInScene } from "@/shared/service/application/usecases/signIn";
import { isSignOutScene } from "@/shared/service/application/usecases/signOut";

export type Mutable<Type> = {
  -readonly [Property in keyof Type]: Type[Property];
};

export interface LocalStore {}
export interface ViewModel<T extends LocalStore> { readonly store: T; }

type ImmutableUser = Readonly<User>;
export interface SharedStore {
    readonly user: ImmutableUser|null;
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
    });

    const user = createUserModel(shared);

    return {
        shared
        , user
        , dispatch(context) {
            if (isBootScene(context)) {
                user.boot(context);
            } else if (isSignUpScene(context)) {
                user.signUp(context);
            } else if (isSignInScene(context)) {
                user.signIn(context);
            } else if (isSignOutScene(context)) {
                user.signOut(context);
            } else {
                throw new Error(`dispatch先が定義されていません: ${ context.scene }`);
            }
        }
    };
}

export const VIEW_MODELS_KEY = Symbol("ViewModels") as InjectionKey<ViewModels>;
