import { BaseActor } from "robustive-ts";
import { Actor } from ".";

export class Nobody extends BaseActor<null> {
    static usecases = {
        boot : {
            basics: {
                userOpensSite: "ユーザはサイトを開く"
                , serviceChecksSession: "サービスはセッションがあるかを確認する"
                , sessionExistsThenServiceGetsUserData: "セッションがある場合_サービスはユーザ情報を取得する"
            }
            , goals: {
                userDataExistsThenServicePresentsHomeView: "ユーザ情報がある場合_サービスはホーム画面を表示する"
                , sessionNotExistsThenServicePresentsSignInView: "セッションがない場合_サービスはサインイン画面を表示する"
                , userDataNotExistsThenServicePerformsSignUpWithGoogleOAuth: "ユーザ情報がない場合_サービスはGoogleOAuthでサインアップするのユースケースを実行する"
            }
        }
        , signIn : {
            basics: {
                userStartsSignInProcess: "ユーザはサインインを開始する"
                , serviceValidateInputs: "サービスは入力項目に問題がないかを確認する"
                , onSuccessInValidatingThenServiceTrySigningIn: "入力項目に問題がない場合_サービスはサインインを試行する"
            }
            , alternatives: {
                userTapsSignUpButton: "ユーザはサインアップボタンをタップする"
            }
            , goals: {
                onSuccessInSigningInThenServicePresentsHomeView: "サインインに成功した場合_サービスはホーム画面を表示する"
                , onFailureInValidatingThenServicePresentsError: "入力項目に問題がある場合_サービスはエラーを表示する"
                , onFailureInSigningInThenServicePresentsError: "サインインに失敗した場合_サービスはエラーを表示する"
                , servicePresentsSignUpView: "サインアップ画面を表示する"
            }
        }
        , signUp : {
            basics : {
                userStartsSignUpProcess: "ユーザはサインアップを開始する"
                , serviceValidateInputs: "サービスは入力項目に問題がないかを確認する"
                , onSuccessInValidatingThenServicePublishNewAccount: "入力項目に問題がない場合_サービスはアカウントを新規に発行する"
                , onSuccessPublishNewAccountThenServiceCreateUserData: "アカウントの発行に成功した場合_サービスはユーザ情報を作成する"
            }
            , alternatives: {
                userStartsSignUpProcessWithGoogleOAuth: "ユーザはGoogleOAuthでのサインアップを開始する"
                , serviceRedirectsToGoogleOAuth: "サービスはGoogle OAuth認証ページにリダイレクトする"
                , userTapsSignInButton: "ユーザはサインインボタンをタップする"
            }
            , goals: {
                onSuccessInCreateUserDataThenServicePresentsHomeView: "ユーザ情報の作成に成功した場合_サービスはホーム画面を表示する"
                , onFailureInValidatingThenServicePresentsError: "入力項目に問題がある場合_サービスはエラーを表示する"
                , onFailureInPublishingThenServicePresentsError: "アカウントの発行に失敗した場合_サービスはエラーを表示する"
                , onFailureInCreateUserDataThenServicePresentsError: "ユーザ情報の作成に失敗した場合_サービスはエラーを表示する"
                , serviceDoNothing: "サービスはなにもしない"
                , servicePresentsSignInView: "サインイン画面を表示する"
            }
        }
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
    } as const;
}
export const isNobody = (actor: Actor): actor is Nobody => actor.constructor === Nobody;