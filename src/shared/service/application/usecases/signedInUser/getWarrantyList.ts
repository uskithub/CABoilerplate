import WarrantyModel, { Warranty } from "@domain/entities/warranty";
import { Application } from "@/shared/service/domain/application/application";
import { catchError, map, Observable } from "rxjs";
import { Context, Empty, MutableContext } from "robustive-ts";
import { SignInUser } from ".";
import { MyBaseScenario } from "../common";

const _u = SignInUser.getWarrantyList;

/**
 * usecase: 保証一覧を取得する
 */


export type GetWarrantyListScenes = {
    basics : {
        [_u.basics.userInitiatesWarrantyListing]: Empty;
        [_u.basics.serviceSelectsWarrantiesThatMeetConditions]: Empty;
    };
    alternatives: Empty;
    goals : {
        [_u.goals.resultIsOneOrMoreThenServiceDisplaysResultOnWarrantyListView]: { warranties: Warranty[]; };
        [_u.goals.resultIsZeroThenServiceDisplaysNoResultOnWarrantyListView]: Empty;
    };
};

export class GetWarrantyListScenario extends MyBaseScenario<GetWarrantyListScenes> {

    next(to: MutableContext<GetWarrantyListScenes>): Observable<Context<GetWarrantyListScenes>> {
        switch (to.scene) {
        case _u.basics.userInitiatesWarrantyListing: {
            return this.just(this.basics[_u.basics.serviceSelectsWarrantiesThatMeetConditions]());
        }
        case _u.basics.serviceSelectsWarrantiesThatMeetConditions: {
            return this.select();
        }
        default: {
            throw new Error(`not implemented: ${ to.scene }`);
        }
        }
    }

    private select(): Observable<Context<GetWarrantyListScenes>> {
        return WarrantyModel
            .get()
            .pipe(
                map((warranties) => {
                    return this.goals[_u.goals.resultIsOneOrMoreThenServiceDisplaysResultOnWarrantyListView]({ warranties });
                })
                // , catchError(error => this.just({ scene: SignOut.goals.onFailureThenServicePresentsError, error }))
            );
    }
}