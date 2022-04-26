import { User } from "@/shared/service/domain/models/user";
import { InjectionKey, reactive } from "vue";
import { createHomeViewModel, HomeViewModel } from "./home";
import { createSignInViewModel, SignInViewModel } from "./signIn";
import { createSignUpViewModel, SignUpViewModel } from "./signUp";

export type Mutable<Type> = {
  -readonly [Property in keyof Type]: Type[Property];
};

export interface LocalStore {}
export interface ViewModel<T extends LocalStore> { readonly local: T; }

type ImmutableUser = Readonly<User>;
export interface SharedStore {
    readonly user: ImmutableUser|null
}

export type ViewModels = {
    shared: SharedStore;
    createHomeViewModel: (shared: SharedStore) => HomeViewModel;
    createSignInViewModel: (shared: SharedStore) => SignInViewModel;
    createSignUpViewModel: (shared: SharedStore) => SignUpViewModel;
}

export function createViewModels(): ViewModels {
    const shared = reactive<SharedStore>({
        user: null
    });
    return {
        shared
        , createHomeViewModel
        , createSignInViewModel
        , createSignUpViewModel
    };
}

export const VIEW_MODELS_KEY = Symbol("ViewModels") as InjectionKey<ViewModels>;
