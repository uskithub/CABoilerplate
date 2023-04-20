import UserModel from "@models/user";
import WarrantyModel from "@models/warranty";
import ServiceModel from "@models/service";
import { catchError, map, Observable } from "rxjs";
import { Actor, boundary, Boundary, Empty, Usecase, UsecaseScenario } from "robustive-ts";
import { Post } from "@api";

/**
 * usecase: 保証一覧を取得する
 */
export const GetWarrantyList = {
    /* Basic Courses */
    userInitiatesWarrantyListing: "ユーザは保証一覧の取得を開始する"
    , serviceSelectsWarrantiesThatMeetConditions: "サービスは条件に該当する保証を抽出する"

    /* Alternate Courses */

    /* Boundaries */
    , goals: {
        /* Basic Courses */
        resultIsOneOrMoreThenServiceDisplaysResultOnWarrantyListView: "結果が1件以上の場合_サービスは保証一覧画面に結果を表示する"
        /* Alternate Courses */
        , resultIsZeroThenServiceDisplaysNoResultOnWarrantyListView: "結果が0件の場合_サービスは保証一覧画面に結果なしを表示する"
    }
} as const;

type GetWarrantyList = typeof GetWarrantyList[keyof typeof GetWarrantyList];

export type GetWarrantyListGoal = UsecaseScenario<{
    [GetWarrantyList.goals.resultIsOneOrMoreThenServiceDisplaysResultOnWarrantyListView]: { warranties: Post[]; }
    [GetWarrantyList.goals.resultIsZeroThenServiceDisplaysNoResultOnWarrantyListView]: Empty
}>;

export type GetWarrantyListScenario = UsecaseScenario<{
    [GetWarrantyList.userInitiatesWarrantyListing]: Empty
    [GetWarrantyList.serviceSelectsWarrantiesThatMeetConditions]: Empty
}> | GetWarrantyListGoal;

export const isGetWarrantyListGoal = (context: any): context is GetWarrantyList => context.scene !== undefined && Object.values(GetWarrantyList.goals).find(c => { return c === context.scene; }) !== undefined;
export const isGetWarrantyListScene = (context: any): context is GetWarrantyListScenario => context.scene !== undefined && Object.values(GetWarrantyList).find(c => { return c === context.scene; }) !== undefined;

export class GetWarrantyListUsecase extends Usecase<GetWarrantyListScenario> {

    override authorize<T extends Actor<T>>(actor: T): boolean {
        return ServiceModel.authorize(actor, this);
    }

    next(): Observable<this> | Boundary {
        switch (this.context.scene) {
        case GetWarrantyList.userInitiatesWarrantyListing: {
            return this.just({ scene: GetWarrantyList.serviceSelectsWarrantiesThatMeetConditions });
        }
        case GetWarrantyList.serviceSelectsWarrantiesThatMeetConditions: {
            return this.select();
        }
        case GetWarrantyList.goals.resultIsOneOrMoreThenServiceDisplaysResultOnWarrantyListView:
        case GetWarrantyList.goals.resultIsZeroThenServiceDisplaysNoResultOnWarrantyListView: {
            return boundary;
        }
        }
    }

    private select(): Observable<this> {
        return WarrantyModel
            .get()
            .pipe(
                map((warranties) => {
                    return this.instantiate({ scene: GetWarrantyList.goals.resultIsOneOrMoreThenServiceDisplaysResultOnWarrantyListView, warranties });
                })
                // , catchError(error => this.just({ scene: SignOut.goals.onFailureThenServicePresentsError, error }))
            );
    }
}