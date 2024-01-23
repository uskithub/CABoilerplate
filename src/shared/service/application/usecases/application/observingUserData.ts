import { Account, UserProperties } from "@/shared/service/domain/authentication/user";
import { Context, Empty, MutableContext } from "robustive-ts";
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
    
    next(to: MutableContext<ObservingUserDataScenes>): Promise<Context<ObservingUserDataScenes>> {
        switch (to.scene) {
        case this.keys.basics.serviceObservedUpdate: {
            const user = to.user as unknown as UserProperties;
            return this.just(this.goals.serviceUpdatesUserData({ user }));
        }
        case this.keys.alternatives.serviceGetsDataForTheFirstTime: {
            const user = to.user as unknown as UserProperties;
            return this.just(this.goals.servicePerformsObservingUsersTasksUsecase({ user }));
        }
        case this.keys.alternatives.serviceGetsNullData: {
            const account = to.account as unknown as Account;
            return this.just(this.goals.servicePerformsSigningUpWithGoogleOAuthUsecase({ account }));
        }
        default: {
            throw new Error(`not implemented: ${ to.scene }`);
        }
        }
    }
}