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
    signInStatus: () => Observable<SignInStatusContext>;

    /**
     * アカウントを作成します。
     */
    createAccount: (mailAddress: string, password: string) => Observable<User>;
}