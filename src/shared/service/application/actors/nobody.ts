import { BaseActor } from "robustive-ts";
import { Actor } from ".";

export class Nobody extends BaseActor<null> {
    static usecases = {
        boot : {
            basics: {
                userOpensSite: "ユーザはサイトを開く"
                , serviceChecksSession: "サービスはセッションがあるかを確認する"
            }
            , goals: {
                sessionExistsThenServicePresentsHome: "セッションがある場合_サービスはホーム画面を表示する"
                , sessionNotExistsThenServicePresentsSignin: "セッションがない場合_サービスはサインイン画面を表示する"
            }
        }
        , signIn : {
            basics: {
                userStartsSignInProcess: "ユーザはサインインを開始する"
                , serviceValidateInputs: "サービスは入力項目に問題がないかを確認する"
                , onSuccessInValidatingThenServiceTrySigningIn: "入力項目に問題がない場合_サービスはサインインを試行する"
            }
            , goals: {
                onSuccessInSigningInThenServicePresentsHomeView: "サインインに成功した場合_サービスはホーム画面を表示する"
                , onFailureInValidatingThenServicePresentsError: "入力項目に問題がある場合_サービスはエラーを表示する"
                , onFailureInSigningInThenServicePresentsError: "サインインに失敗した場合_サービスはエラーを表示する"
            }
        }
        , signUp : {
            basics : {
                userStartsSignUpProcess: "ユーザはサインアップを開始する"
                , serviceValidateInputs: "サービスは入力項目に問題がないかを確認する"
                , onSuccessInValidatingThenServicePublishNewAccount: "入力項目に問題がない場合_サービスはアカウントを新規に発行する"
            }
            , goals: {
                onSuccessInPublishingThenServicePresentsHomeView: "アカウントの発行に成功した場合_サービスはホーム画面を表示する"
                , onFailureInValidatingThenServicePresentsError: "入力項目に問題がある場合_サービスはエラーを表示する"
                , onFailureInPublishingThenServicePresentsError: "アカウントの発行に失敗した場合_サービスはエラーを表示する"
            }
        }
    } as const;
}
export const isNobody = (actor: Actor): actor is Nobody => actor.constructor === Nobody;