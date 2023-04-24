import UserModel from "@models/user";
import WarrantyModel from "@models/warranty";
import ServiceModel from "@models/service";
import { catchError, map, Observable } from "rxjs";
import { Actor, boundary, Boundary, Empty, Usecase, Scenes as _S } from "robustive-ts";

/**
 * usecase: 保証一覧を取得する
 */
export const scenes = {
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

type GetWarrantyList = typeof scenes[keyof typeof scenes];

export type Goals = _S<{
    [scenes.goals.resultIsOneOrMoreThenServiceDisplaysResultOnWarrantyListView]: { warranties: Post[]; }
    [scenes.goals.resultIsZeroThenServiceDisplaysNoResultOnWarrantyListView]: Empty
}>;

export type Scenes = _S<{
    [scenes.userInitiatesWarrantyListing]: Empty
    [scenes.serviceSelectsWarrantiesThatMeetConditions]: Empty
}> | Goals;

export const isGetWarrantyListGoal = (context: any): context is Goals => context.scene !== undefined && Object.values(scenes.goals).find(c => { return c === context.scene; }) !== undefined;
export const isGetWarrantyListScene = (context: any): context is Scenes => context.scene !== undefined && Object.values(scenes).find(c => { return c === context.scene; }) !== undefined;

export const GetWarrantyList = scenes;
export type GetWarrantyListGoals = Goals;
export type GetWarrantyListScenes = Scenes;

export class GetWarrantyListUsecase extends Usecase<Scenes> {

    override authorize<T extends Actor<T>>(actor: T): boolean {
        return ServiceModel.authorize(actor, this);
    }

    next(): Observable<this> | Boundary {
        switch (this.context.scene) {
        case scenes.userInitiatesWarrantyListing: {
            return this.just({ scene: scenes.serviceSelectsWarrantiesThatMeetConditions });
        }
        case scenes.serviceSelectsWarrantiesThatMeetConditions: {
            return this.select();
        }
        case scenes.goals.resultIsOneOrMoreThenServiceDisplaysResultOnWarrantyListView:
        case scenes.goals.resultIsZeroThenServiceDisplaysNoResultOnWarrantyListView: {
            return boundary;
        }
        }
    }

    private select(): Observable<this> {
        return WarrantyModel
            .get()
            .pipe(
                map((warranties) => {
                    return this.instantiate({ scene: scenes.goals.resultIsOneOrMoreThenServiceDisplaysResultOnWarrantyListView, warranties });
                })
                // , catchError(error => this.just({ scene: SignOut.goals.onFailureThenServicePresentsError, error }))
            );
    }
}