import { InjectionKey, reactive } from "vue";
import { createHomeViewModel, HomeViewModel } from "./home";
import { createSignInViewModel, SignInViewModel } from "./signIn";
import { createSignUpViewModel, SignUpViewModel } from "./signUp";

export interface State {}
export interface ViewModel<T extends State> { state: T; }

export interface Store {}

export type ViewModels = {
    store: Store;
    createHomeViewModel: () => HomeViewModel;
    createSignInViewModel: () => SignInViewModel;
    createSignUpViewModel: () => SignUpViewModel;
}

export function createViewModels(): ViewModels {
    const store = reactive<Store>({});
    return {
        store
        , createHomeViewModel
        , createSignInViewModel
        , createSignUpViewModel
    };
}

export const VIEW_MODELS_KEY = Symbol("ViewModels") as InjectionKey<ViewModels>;
