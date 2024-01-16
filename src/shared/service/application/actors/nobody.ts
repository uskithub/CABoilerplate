import { BaseActor } from "robustive-ts";
import { Actor } from ".";

export class Nobody extends BaseActor<null> {
    
        // , signInWithGoogleOAuth : {
        //     basics: {
        //         userStartsSignInProcess: "ユーザはサインインを開始する"
        //         , systemRedirectsToGoogleOAuth: "システムはGoogle OAuth認証ページにリダイレクトする"
        //         , userAuthenticatesWithGoogle: "ユーザはGoogleアカウントで認証を行う"
        //         , systemReceivesAuthToken: "システムは認証トークンを受け取る"
        //     }
        //     , alternatives: {
        //         service
        //         errorDuringGoogleOAuth: "Google OAuth認証中にエラーが発生する"
        //         , systemDisplaysErrorAndRedirects: "システムがエラーメッセージを表示し、ログインページにリダイレクトする"
        //     }
        //     , goals: {
        //         systemDisplaysHomepage: "システムがホームページを表示する"
        //     }
        // }
}
export const isNobody = (actor: Actor): actor is Nobody => actor.constructor === Nobody;