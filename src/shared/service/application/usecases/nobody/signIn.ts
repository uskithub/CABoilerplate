
import { SignInValidationResult, User, Account } from "@/shared/service/domain/authentication/user";
import { Nobody } from "../../actors/nobody";
import { MyBaseScenario } from "../common";

import type { Context, Empty, MutableContext } from "robustive-ts";
import { catchError, firstValueFrom, map } from "rxjs";


const _u = Nobody.usecases.signIn;

/**
 * usecase: サインインする
 */
export type SignInScenes = {
    basics : {
        [_u.basics.userStartsSignInProcess]: { id: string | null; password: string | null; };
        [_u.basics.serviceValidateInputs]: { id: string | null; password: string | null; };
        [_u.basics.onSuccessInValidatingThenServiceTrySigningIn]: { id: string; password: string; };
    };
    alternatives: {
        [_u.alternatives.userTapsSignUpButton]: Empty;
    };
    goals : {
        [_u.goals.onSuccessInSigningInThenServicePresentsHomeView]: { account: Account; };
        [_u.goals.onFailureInValidatingThenServicePresentsError]: { result: SignInValidationResult; };
        [_u.goals.onFailureInSigningInThenServicePresentsError]: { error: Error; };
        [_u.goals.servicePresentsSignUpView]: Empty;
    };
};


export class SignInScenario extends MyBaseScenario<SignInScenes> {

    next(to: MutableContext<SignInScenes>): Promise<Context<SignInScenes>> {
        switch (to.scene) {
        case _u.basics.userStartsSignInProcess: {
            return this.just(this.basics[_u.basics.serviceValidateInputs]({ id: to.id, password: to.password }));
        }
        case _u.basics.serviceValidateInputs: {
            return this.validate(to.id, to.password);
        }
        case _u.basics.onSuccessInValidatingThenServiceTrySigningIn: {
            return this.signIn(to.id, to.password);
        }
        case _u.alternatives.userTapsSignUpButton: {
            return this.just(this.goals[_u.goals.servicePresentsSignUpView]());
        }
        default: {
            throw new Error(`not implemented: ${ to.scene }`);
        }
        }
    }

    private validate(id: string | null, password: string | null): Promise<Context<SignInScenes>> {
        const result = User.validate(id, password);
        if (result === true && id !== null && password != null) {
            return this.just(this.basics[_u.basics.onSuccessInValidatingThenServiceTrySigningIn]({ id, password }));
        } else {
            return this.just(this.goals[_u.goals.onFailureInValidatingThenServicePresentsError]({ result }));
        }
    }

    private signIn(id: string, password: string): Promise<Context<SignInScenes>> {
        return firstValueFrom(
            User.signIn(id, password)
                .pipe(
                    map(account => this.goals[_u.goals.onSuccessInSigningInThenServicePresentsHomeView]({ account }))
                    , catchError((error: Error) => this.just(this.goals[_u.goals.onFailureInSigningInThenServicePresentsError]({ error })))
                )
        );
    }
}