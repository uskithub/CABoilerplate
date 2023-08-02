import { User, type SignUpValidationResult, type UserProperties } from "@/shared/service/domain/authentication/user";
import { Application } from "@/shared/service/domain/application/application";
import { Empty } from "robustive-ts";
import type { Context, MutableContext } from "robustive-ts";
import { first, map, Observable } from "rxjs";
import { Nobody } from ".";
import { MyBaseScenario } from "../common";

const _u = Nobody.signUp;

/**
 * usecase: サインアップする
 */
export type SignUpScenes = {
    basics : {
        [_u.basics.userStartsSignUpProcess]: { id: string | null; password: string | null; };
        [_u.basics.serviceValidateInputs]: { id: string | null; password: string | null; };
        [_u.basics.onSuccessInValidatingThenServicePublishNewAccount]: { id: string; password: string; };
    }
    alternatives: Empty;
    goals : {
        [_u.goals.onSuccessInPublishingThenServicePresentsHomeView]: { user: UserProperties; };
        [_u.goals.onFailureInValidatingThenServicePresentsError]: { result: SignUpValidationResult; };
        [_u.goals.onFailureInPublishingThenServicePresentsError]: { error: Error; };
    }
};

export class SignUpScenario extends MyBaseScenario<SignUpScenes> {

    // override authorize<T extends Actor<T>>(actor: T): boolean {
    //     return Application.authorize(actor, this);
    // }

    next(to: MutableContext<SignUpScenes>): Observable<Context<SignUpScenes>> {
        switch (to.scene) {
        case _u.basics.userStartsSignUpProcess: {
            return this.just(this.basics[_u.basics.serviceValidateInputs]({ id: to.id, password: to.password }));
        }
        case _u.basics.serviceValidateInputs: {
            return this.validate(to.id, to.password);
        }
        case _u.basics.onSuccessInValidatingThenServicePublishNewAccount: {
            return this.publishNewAccount(to.id, to.password);
        }
        default: {
            throw new Error(`not implemented: ${ to.scene }`);
        }
        }
    }

    private validate(id: string | null, password: string | null): Observable<Context<SignUpScenes>> {
        const result = User.validate(id, password);
        if (result === true && id !== null && password != null) {
            return this.just(this.basics[_u.basics.onSuccessInValidatingThenServicePublishNewAccount]({ id, password }));
        } else {
            return this.just(this.goals[_u.goals.onFailureInValidatingThenServicePresentsError]({ result }));
        }
    }

    private publishNewAccount(id: string, password: string): Observable<Context<SignUpScenes>> {
        return User
            .create(id, password)
            .pipe(
                map((userProperties: UserProperties) => {
                    return this.goals[_u.goals.onSuccessInPublishingThenServicePresentsHomeView]({ user: userProperties });
                })
                , first() // 一度観測したらsubscriptionを終わらせる
            );
    }
}