import { User } from "@/shared/service/domain/authentication/user";
import { Application } from "@/shared/service/domain/application/application";
import { catchError, map, Observable } from "rxjs";
import { Actor, BaseScenario, Context, Empty } from "robustive-ts";
import { SignInUserUsecases } from ".";

const _u = SignInUserUsecases.signOut;

/**
 * usecase: サインアウトする
 */
export type SignOutScenes = {
    basics : {
        [_u.basics.userStartsSignOutProcess]: Empty;
        [_u.basics.serviceClosesSession]: Empty;
    };
    alternatives: {
        [_u.alternatives.userResignSignOut]: Empty;
    };
    goals: {
        [_u.goals.onSuccessThenServicePresentsSignInView]: Empty;
        [_u.goals.onFailureThenServicePresentsError]: { error: Error; };
        [_u.goals.servicePresentsHomeView]: Empty;
    };
};

export class SignOutScenario extends BaseScenario<SignOutScenes> {

    // override authorize<T extends Actor<T>>(actor: T): boolean {
    //     return Application.authorize(actor, this);
    // }

    next(to: Context<SignOutScenes>): Observable<Context<SignOutScenes>> {
        switch (to.scene) {
        case _u.basics.userStartsSignOutProcess: {
            return this.just(this.basics[_u.basics.serviceClosesSession]());
        }
        case _u.basics.serviceClosesSession: {
            return this.signOut();
        }
        case _u.alternatives.userResignSignOut: {
            return this.just(this.goals[_u.goals.servicePresentsHomeView]());
        }
        default: {
            throw new Error(`not implemented: ${ to.scene }`);
        }
        }
    }

    private signOut(): Observable<Context<SignOutScenes>> {
        return User.signOut()
            .pipe(
                map(() => this.goals[_u.goals.onSuccessThenServicePresentsSignInView]())
                , catchError((error: Error) => this.just(this.goals[_u.goals.onFailureThenServicePresentsError]({ error })))
            );
    }
}