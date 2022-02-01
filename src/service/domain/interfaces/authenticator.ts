import { Observable } from "rxjs";
import { User } from "../models/user";

/**
 * サインインステータス
 */
 export const enum SignInStatus {
    signIn = "signIn"
    , signingIn = "signingIn"
    , signOut = "signOut"
    , signingOut = "signingOut"
}

export type SignInStatusContext = { kind: SignInStatus.signIn; user: User }
    | { kind: SignInStatus.signingIn }
    | { kind: SignInStatus.signOut }
    | { kind: SignInStatus.signingOut }
;

export interface Authenticator {
    /**
     * サインインステータスの監視を開始します。
     */
    observeSignInStatus: () => Observable<SignInStatusContext>;
}