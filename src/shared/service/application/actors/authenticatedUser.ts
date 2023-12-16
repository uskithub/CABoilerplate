
import { Account } from "@/shared/service/domain/authentication/user";
import { BaseActor } from "robustive-ts";
import { Actor } from ".";

export class AuthenticatedUser extends BaseActor<Account> {
    static usecases = {
        signOut : {
            basics : {
                userStartsSignOutProcess: "ユーザはサインアウトを開始する"
                , serviceClosesSession: "サービスはセッションを終了する"
            }
            , alternatives : {
                userResignSignOut: "ユーザはサインアウトをキャンセルする"
            }
            , goals: {
                onSuccessThenServicePresentsSignInView: "成功した場合_サービスはサインイン画面を表示する"
                , onFailureThenServicePresentsError: "失敗した場合_サービスはエラーを表示する"
                , servicePresentsHomeView: "サービスはホーム画面を表示する"
            }
        }
        , observingProject : {
            basics : {
                userSelectsAProject: "ユーザはプロジェクトを選択する"
                , serviceStartsObservingProjectThatMeetConditions: "サービスは条件に該当するプロジェクトの観測を開始する"
            }
            , goals : {
                servicePresentsProjectView: "サービスはプロジェクト画面を表示する"
                , onUpdatProjectThenServiceUpdatesProjectView: "プロジェクトに更新があった場合_サービスはプロジェクト画面を更新する"
            }
        }
        , consult : {
            basics : {
                userInputsQuery: "ユーザは質問を入力する"
                , serviceChecksIfThereAreExistingMessages: "サービスは既存の会話があるか確認する"
                , ifThereAreThenServiceGetRelatedVectors: "ある場合_サービスは会話に関連するベクトル情報を取得する"
                , onSuccessThenServiceAskAI: "成功した場合_サービスはAIに問い合わせする"
            }
            , alternatives : {
                ifNotThenServiceGetRelatedVectors: "ない場合_サービスは質問に関連するベクトル情報を取得する"
            }
            , goals: {
                onSuccessThenServiceDisplaysMessages: "成功した場合_サービスは会話を表示する"
                , onFailureThenServicePresentsError: "失敗した場合_サービスはエラーを表示する"
            }
        }
        , listInsuranceItems : {
            basics : {
                userInitiatesListing: "ユーザは一覧取得を開始する"
                , serviceSelectsInsuranceItemsThatMeetConditions: "サービスは条件に該当する保険加入アイテムを抽出する"
            }
            , goals: {
                resultIsOneOrMoreThenServiceDisplaysResultOnInsuranceItemListView: "結果が1件以上の場合_サービスは保険加入アイテム一覧画面に結果を表示する"
                , resultIsZeroThenServiceDisplaysNoResultOnInsuranceItemListView: "結果が0件の場合_サービスは保険加入アイテム一覧画面に結果なしを表示する"
            }
        }
        , getWarrantyList : {
            basics : {
                userInitiatesWarrantyListing: "ユーザは保証一覧の取得を開始する"
                , serviceSelectsWarrantiesThatMeetConditions: "サービスは条件に該当する保証を抽出する"
            }
            , goals: {
                resultIsOneOrMoreThenServiceDisplaysResultOnWarrantyListView: "結果が1件以上の場合_サービスは保証一覧画面に結果を表示する"
                , resultIsZeroThenServiceDisplaysNoResultOnWarrantyListView: "結果が0件の場合_サービスは保証一覧画面に結果なしを表示する"
            }
        }
    } as const;
}
export const isAuthenticatedUser = (actor: Actor): actor is AuthenticatedUser => actor.constructor === AuthenticatedUser;