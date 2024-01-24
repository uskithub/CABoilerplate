import WarrantyModel, { Warranty } from "@domain/entities/warranty";
import { MyBaseScenario } from "../common";

import type { Context, Empty } from "robustive-ts";
import { firstValueFrom, map } from "rxjs";

/**
 * usecase: 保証一覧を取得する
 */
export type GetWarrantyListScenes = {
    basics : {
        userInitiatesWarrantyListing: Empty;
        serviceSelectsWarrantiesThatMeetConditions: Empty;
    };
    alternatives: Empty;
    goals : {
        resultIsOneOrMoreThenServiceDisplaysResultOnWarrantyListView: { warranties: Warranty[]; };
        resultIsZeroThenServiceDisplaysNoResultOnWarrantyListView: Empty;
    };
};

export class GetWarrantyListScenario extends MyBaseScenario<GetWarrantyListScenes> {

    next(to: Context<GetWarrantyListScenes>): Promise<Context<GetWarrantyListScenes>> {
        switch (to.scene) {
        case this.keys.basics.userInitiatesWarrantyListing: {
            return this.just(this.basics.serviceSelectsWarrantiesThatMeetConditions());
        }
        case this.keys.basics.serviceSelectsWarrantiesThatMeetConditions: {
            return this.select();
        }
        default: {
            throw new Error(`not implemented: ${ to.scene }`);
        }
        }
    }

    private select(): Promise<Context<GetWarrantyListScenes>> {
        return firstValueFrom(
            WarrantyModel
                .get()
                .pipe(
                    map((warranties) => {
                        return this.goals.resultIsOneOrMoreThenServiceDisplaysResultOnWarrantyListView({ warranties });
                    })
                // , catchError(error => this.just({ scene: SignOut.goals.onFailureThenServicePresentsError, error }))
                )
        );
    }
}