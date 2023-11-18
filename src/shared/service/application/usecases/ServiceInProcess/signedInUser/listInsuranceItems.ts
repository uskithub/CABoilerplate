import InsuranceItemModel from "@shared/service/domain/ServiceInProcess/models/insuranceItem";
import { InsuranceItem } from "@/shared/service/infrastructure/API";
import { SignedInUser } from "../../../actors/signedInUser";
import { MyBaseScenario } from "../../common";

import type { Context, Empty, MutableContext } from "robustive-ts";
import { firstValueFrom, map } from "rxjs";

const _u = SignedInUser.usecases.listInsuranceItems;

/**
 * usecase: 保険加入アイテム一覧を取得する
 */
export type ListInsuranceItemsScenes = {
    basics : {
        [_u.basics.userInitiatesListing]: Empty;
        [_u.basics.serviceSelectsInsuranceItemsThatMeetConditions]: Empty;
    };
    alternatives: Empty;
    goals : {
        [_u.goals.resultIsOneOrMoreThenServiceDisplaysResultOnInsuranceItemListView]: { insuranceItems: InsuranceItem[] | null; };
        [_u.goals.resultIsZeroThenServiceDisplaysNoResultOnInsuranceItemListView]: Empty;
    };
};

export class ListInsuranceItemsScenario extends MyBaseScenario<ListInsuranceItemsScenes> {

    next(to: MutableContext<ListInsuranceItemsScenes>): Promise<Context<ListInsuranceItemsScenes>> {
        switch (to.scene) {
        case _u.basics.userInitiatesListing: {
            return this.just(this.basics[_u.basics.serviceSelectsInsuranceItemsThatMeetConditions]());
        }
        case _u.basics.serviceSelectsInsuranceItemsThatMeetConditions: {
            return this.select();
        }
        default: {
            throw new Error(`not implemented: ${ to.scene }`);
        }
        }
    }

    private select(): Promise<Context<ListInsuranceItemsScenes>> {
        return firstValueFrom(
            InsuranceItemModel
                .list()
                .pipe(
                    map((insuranceItems) => {
                        return this.goals[_u.goals.resultIsOneOrMoreThenServiceDisplaysResultOnInsuranceItemListView]({ insuranceItems });
                    })
                // , catchError(error => this.just({ scene: SignOut.goals.onFailureThenServicePresentsError, error }))
                )
        );
    }
}