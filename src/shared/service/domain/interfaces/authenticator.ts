import { Observable } from "rxjs";
import { User } from "../models/user";
import { UserProperties } from "../authentication/user";

/**
 * サインインステータス
 */
export const enum SignInStatus {
    signIn = "signIn"
    , signingIn = "signingIn"
    , signOut = "signOut"
    , signingOut = "signingOut"
    , unknown = "unknown"
}

export type SignInStatusContext = { kind: SignInStatus.signIn; user: UserProperties }
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
    createAccount: (mailAddress: string, password: string) => Observable<UserProperties>;

    /**
     * サインインします。
     */
    signIn: (mailAddress: string, password: string) => Observable<UserProperties>;

    /**
     * サインアウトします。
     */
    signOut: () => Observable<void>;
}