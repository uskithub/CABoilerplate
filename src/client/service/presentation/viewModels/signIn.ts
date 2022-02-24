import { Usecase } from "@shared/system/interfaces/usecase";
import { Subscription } from "rxjs";
import { reactive } from "vue";
import { State, ViewModel } from ".";

export interface SignInState extends State {
    email: string|null;
    password: string|null;
    isValid: boolean;
}

export interface SignInViewModel extends ViewModel<SignInState> {
    state: SignInState
    emailRules: Array<(v: string)=>string|boolean>;
    passwordRules: Array<(v: string)=>string|boolean>;
    signIn: ()=>void
}

export function createSignInViewModel(): SignInViewModel {
    const state = reactive<SignInState>({
        email: null
        , password: null
        , isValid: true
    });

    return {
        state
        , emailRules: [
            v => !!v || "E-mail is required"
            , v => /.+@.+\..+/.test(v) || "E-mail must be valid"
        ]
        , passwordRules: [
            v => !!v || "Password is required"
            , v => (v && 8 <= v.length) || "Name must be more than 8 characters"
        ]
        , signIn: () => {
            const subscription: Subscription|null = null;
            // subscription = Usecase
            //     .interact<SignUpContext, SignUpScene>(new BootScene())
            //     .subscribe({
            //         next: (performedSenario) => {
            //             const lastContext = performedSenario.slice(-1)[0];
            //             switch(lastContext.scene){
            //                 case Boot.sessionExistsThenPresentHome:
            //                     break;
            //                 case Boot.sessionNotExistsThenPreesntSignin:
            //                     this.#router.replace("/signin");
            //                     break;
            //             }
            //         }
            //         , error: (e) => console.error(e)
            //         , complete: () => {
            //             console.info('complete')
            //             subscription?.unsubscribe();
            //         }
            //     });
        }
    };
}