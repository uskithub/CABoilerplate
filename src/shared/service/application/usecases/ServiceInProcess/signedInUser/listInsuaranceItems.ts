// Service
import InsuranceItemModel from "@shared/service/domain/ServiceInProcess/models/insuranceItem";
import ServiceModel from "@models/service";
import { InsuranceItem } from "@/shared/service/infrastructure/API";

// System
import { map, Observable } from "rxjs";
import { Actor, boundary, Boundary, Empty, Usecase, UsecaseScenario } from "robustive-ts";


/**
 * usecase: 保険加入アイテム一覧を取得する
 */
export const ListInsuranceItems = {
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

type ListInsuranceItems = typeof ListInsuranceItems[keyof typeof ListInsuranceItems];

export type ListInsuranceItemsGoal = UsecaseScenario<{
    [ListInsuranceItems.goals.resultIsOneOrMoreThenServiceDisplaysResultOnInsuranceItemListView]: { insuranceItems: InsuranceItem[]|null; }
    [ListInsuranceItems.goals.resultIsZeroThenServiceDisplaysNoResultOnInsuranceItemListView]: Empty
}>;

export type ListInsuranceItemsScenario = UsecaseScenario<{
    [ListInsuranceItems.userInitiatesListing]: Empty
    [ListInsuranceItems.serviceSelectsInsuranceItemsThatMeetConditions]: Empty
}> | ListInsuranceItemsGoal;

export const isListInsuranceItemsGoal = (context: any): context is ListInsuranceItems => context.scene !== undefined && Object.values(ListInsuranceItems.goals).find(c => { return c === context.scene; }) !== undefined;
export const isListInsuranceItemsScene = (context: any): context is ListInsuranceItemsScenario => context.scene !== undefined && Object.values(ListInsuranceItems).find(c => { return c === context.scene; }) !== undefined;

export class ListInsuranceItemsUsecase extends Usecase<ListInsuranceItemsScenario> {

    override authorize<T extends Actor<T>>(actor: T): boolean {
        return ServiceModel.authorize(actor, this);
    }

    next(): Observable<this> | Boundary {
        switch (this.context.scene) {
        case ListInsuranceItems.userInitiatesListing: {
            return this.just({ scene: ListInsuranceItems.serviceSelectsInsuranceItemsThatMeetConditions });
        }
        case ListInsuranceItems.serviceSelectsInsuranceItemsThatMeetConditions: {
            return this.select();
        }
        case ListInsuranceItems.goals.resultIsOneOrMoreThenServiceDisplaysResultOnInsuranceItemListView:
        case ListInsuranceItems.goals.resultIsZeroThenServiceDisplaysNoResultOnInsuranceItemListView: {
            return boundary;
        }
        }
    }

    private select(): Observable<this> {
        return InsuranceItemModel
            .list()
            .pipe(
                map((insuranceItems) => {
                    return this.instantiate({ scene: ListInsuranceItems.goals.resultIsOneOrMoreThenServiceDisplaysResultOnInsuranceItemListView, insuranceItems });
                })
                // , catchError(error => this.just({ scene: SignOut.goals.onFailureThenServicePresentsError, error }))
            );
    }
}