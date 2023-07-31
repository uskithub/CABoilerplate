// Service
import InsuranceItemModel from "@shared/service/domain/ServiceInProcess/models/insuranceItem";
import { Application } from "@/shared/service/domain/application/application";
import { InsuranceItem } from "@/shared/service/infrastructure/API";

// System
import { map, Observable } from "rxjs";
import { Actor, BaseScenario, Context, Empty } from "robustive-ts";
import { SignInUserUsecases } from "../../signedInUser";

const _u = SignInUserUsecases.listInsuranceItems;

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

export class ListInsuranceItemsScenario extends BaseScenario<ListInsuranceItemsScenes> {

    // override authorize<T extends Actor<T>>(actor: T): boolean {
    //     return Application.authorize(actor, this);
    // }

    next(to: Context<ListInsuranceItemsScenes>): Observable<Context<ListInsuranceItemsScenes>> {
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

    private select(): Observable<Context<ListInsuranceItemsScenes>> {
        return InsuranceItemModel
            .list()
            .pipe(
                map((insuranceItems) => {
                    return this.goals[_u.goals.resultIsOneOrMoreThenServiceDisplaysResultOnInsuranceItemListView]({ insuranceItems });
                })
                // , catchError(error => this.just({ scene: SignOut.goals.onFailureThenServicePresentsError, error }))
            );
    }
}