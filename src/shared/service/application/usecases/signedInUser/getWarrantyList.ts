import WarrantyModel, { Warranty } from "@domain/entities/warranty";
import { Application } from "@/shared/service/domain/application/application";
import { catchError, map, Observable } from "rxjs";
import { Actor, BaseScenario, Context, Empty } from "robustive-ts";
import { SignInUserUsecases } from ".";

const _u = SignInUserUsecases.getWarrantyList;

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

export class GetWarrantyListScenario extends BaseScenario<GetWarrantyListScenes> {

    // override authorize<T extends Actor<T>>(actor: T): boolean {
    //     return Application.authorize(actor, this);
    // }

    next(to: Context<GetWarrantyListScenes>): Observable<Context<GetWarrantyListScenes>> {
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