// Service
import InsuranceItemModel from "@shared/service/domain/ServiceInProcess/models/insuranceItem";
import ServiceModel from "@models/service";
import { InsuranceItem } from "@/shared/service/infrastructure/API";

// System
import { map, Observable } from "rxjs";
import { Actor, boundary, Boundary, ContextualizedScenes, Empty, Usecase } from "robustive-ts";

/**
 * usecase: 保険加入アイテム一覧を取得する
 */
const scenes = {
    /* Basic Courses */
    userInitiatesListing: "ユーザは一覧取得を開始する"
    , serviceSelectsInsuranceItemsThatMeetConditions: "サービスは条件に該当する保険加入アイテムを抽出する"

    /* Alternate Courses */

    /* Boundaries */
    , goals: {
        /* Basic Courses */
        resultIsOneOrMoreThenServiceDisplaysResultOnInsuranceItemListView: "結果が1件以上の場合_サービスは保険加入アイテム一覧画面に結果を表示する"
        /* Alternate Courses */
        , resultIsZeroThenServiceDisplaysNoResultOnInsuranceItemListView: "結果が0件の場合_サービスは保険加入アイテム一覧画面に結果なしを表示する"
    }
} as const;

type Goals = ContextualizedScenes<{
    [scenes.goals.resultIsOneOrMoreThenServiceDisplaysResultOnInsuranceItemListView]: { insuranceItems: InsuranceItem[]|null; }
    [scenes.goals.resultIsZeroThenServiceDisplaysNoResultOnInsuranceItemListView]: Empty
}>;

type Scenes = ContextualizedScenes<{
    [scenes.userInitiatesListing]: Empty
    [scenes.serviceSelectsInsuranceItemsThatMeetConditions]: Empty
}> | Goals;

export const ListInsuranceItems = scenes;
export type ListInsuranceItems = typeof scenes[keyof typeof scenes];
export type ListInsuranceItemsGoals = Goals;
export type ListInsuranceItemsScenes = Scenes;

export const isListInsuranceItemsGoal = (context: Record<"scene", any> & Record<string, any>): context is Goals => context.scene !== undefined && Object.values(scenes.goals).find(c => { return c === context.scene; }) !== undefined;
export const isListInsuranceItemsScene = (context: Record<"scene", any> & Record<string, any>): context is Scenes => context.scene !== undefined && Object.values(scenes).find(c => { return c === context.scene; }) !== undefined;

export class ListInsuranceItemsUsecase extends Usecase<Scenes> {

    override authorize<T extends Actor<T>>(actor: T): boolean {
        return ServiceModel.authorize(actor, this);
    }

    next(): Observable<this> | Boundary {
        switch (this.context.scene) {
        case scenes.userInitiatesListing: {
            return this.just({ scene: scenes.serviceSelectsInsuranceItemsThatMeetConditions });
        }
        case scenes.serviceSelectsInsuranceItemsThatMeetConditions: {
            return this.select();
        }
        case scenes.goals.resultIsOneOrMoreThenServiceDisplaysResultOnInsuranceItemListView:
        case scenes.goals.resultIsZeroThenServiceDisplaysNoResultOnInsuranceItemListView: {
            return boundary;
        }
        }
    }

    private select(): Observable<this> {
        return InsuranceItemModel
            .list()
            .pipe(
                map((insuranceItems) => {
                    return this.instantiate({ scene: scenes.goals.resultIsOneOrMoreThenServiceDisplaysResultOnInsuranceItemListView, insuranceItems });
                })
                // , catchError(error => this.just({ scene: SignOut.goals.onFailureThenServicePresentsError, error }))
            );
    }
}