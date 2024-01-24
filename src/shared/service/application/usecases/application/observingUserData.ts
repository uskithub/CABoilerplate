import { Account, UserProperties } from "@/shared/service/domain/authentication/user";
import { Context } from "robustive-ts";
import { Observable } from "rxjs";
import { MyBaseScenario } from "../../common";

/**
 * usecase: ユーザ情報を観測する
 */
export type ObservingUserDataScenes = {
    basics: {
        serviceObservedUpdate: { user: UserProperties; };
    };
    alternatives: {
        serviceGetsDataForTheFirstTime: { user: UserProperties; };
        serviceGetsNullData: { account: Account; };
    };
    goals: {
        servieStartsObserving: { account: Account; userDataObservable: Observable<UserProperties | null>; };
        serviceUpdatesUserData: { user: UserProperties; };
        servicePerformsObservingUsersTasksUsecase: { user: UserProperties; };
        servicePerformsSigningUpWithGoogleOAuthUsecase: { account: Account; };
    };
};

export class ObservingUserDataScenario extends MyBaseScenario<ObservingUserDataScenes> {
    
    next(to: Context<ObservingUserDataScenes>): Promise<Context<ObservingUserDataScenes>> {
        switch (to.scene) {
        case this.keys.basics.serviceObservedUpdate: {
            return this.just(this.goals.serviceUpdatesUserData({ user: to.user }));
        }
        case this.keys.alternatives.serviceGetsDataForTheFirstTime: {
            return this.just(this.goals.servicePerformsObservingUsersTasksUsecase({ user: to.user }));
        }
        case this.keys.alternatives.serviceGetsNullData: {
            return this.just(this.goals.servicePerformsSigningUpWithGoogleOAuthUsecase({ account: to.account }));
        }
        default: {
            throw new Error(`not implemented: ${ to.scene }`);
        }
        }
    }
}