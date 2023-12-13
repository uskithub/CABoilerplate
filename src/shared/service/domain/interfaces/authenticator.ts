import { Observable } from "rxjs";
import { Account, UserCredential } from "../authentication/user";
import { SwiftEnum, SwiftEnumCases } from "@/shared/system/utils/enum";
import { Empty } from "robustive-ts";

/**
 * サインインステータス
 */
export const SignInStatus = {
    signIn : "signIn"
    , signingIn : "signingIn"
    , signOut : "signOut"
    , signingOut : "signingOut"
    , unknown : "unknown"
} as const;

type SignInStatusContext = { 
    [SignInStatus.signIn] : { account: Account; };
    [SignInStatus.signingIn] : Empty;
    [SignInStatus.signOut] : Empty;
    [SignInStatus.signingOut] : Empty;
    [SignInStatus.unknown] : Empty;
};

export const SignInStatuses = new SwiftEnum<SignInStatusContext>();
export type SignInStatus = SwiftEnumCases<SignInStatusContext>;

export interface Authenticator {
    /**
     * サインインステータスの監視を開始します。
     */
    signInStatus: () => Observable<SignInStatus>;

    /**
     * アカウントを作成します。
     */
    createAccount: (mailAddress: string, password: string) => Observable<Account>;

    /**
     * サインインします。
     */
    signIn: (mailAddress: string, password: string) => Observable<Account>;

    /**
     * サインアウトします。
     */
    signOut: () => Observable<void>;

    oauthToGoogle: (scope: string[]) => Promise<void>;

    getGoogleOAuthRedirectResult: () => Promise<UserCredential|null>;
}