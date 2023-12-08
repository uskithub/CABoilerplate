import { User, type SignUpValidationResult, type UserProperties } from "@/shared/service/domain/authentication/user";
import { Nobody } from "../../actors/nobody";
import { MyBaseScenario } from "../common";

import type { Context, Empty, MutableContext } from "robustive-ts";
import { firstValueFrom, map } from "rxjs";

const _u = Nobody.usecases.signUp;

/**
 * usecase: サインアップする
 */
export type SignUpScenes = {
    basics : {
        [_u.basics.userStartsSignUpProcess]: { id: string | null; password: string | null; };
        [_u.basics.serviceValidateInputs]: { id: string | null; password: string | null; };
        [_u.basics.onSuccessInValidatingThenServicePublishNewAccount]: { id: string; password: string; };
    };
    alternatives: {
        [_u.alternatives.userStartsSignUpProcessWithGoogleOAuth]: Empty;
        [_u.alternatives.serviceRedirectsToGoogleOAuth]: Empty;
        [_u.alternatives.userTapsSignInButton]: Empty;
    };
    goals : {
        [_u.goals.onSuccessInPublishingThenServicePresentsHomeView]: { user: UserProperties; };
        [_u.goals.onFailureInValidatingThenServicePresentsError]: { result: SignUpValidationResult; };
        [_u.goals.onFailureInPublishingThenServicePresentsError]: { error: Error; };
        [_u.goals.serviceDoNothing]: Empty;
        [_u.goals.servicePresentsSignInView]: Empty;
    };
};

export class SignUpScenario extends MyBaseScenario<SignUpScenes> {

    next(to: MutableContext<SignUpScenes>): Promise<Context<SignUpScenes>> {
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
        case _u.alternatives.userStartsSignUpProcessWithGoogleOAuth: {
            return this.just(this.alternatives[_u.alternatives.serviceRedirectsToGoogleOAuth]());
        }
        case _u.alternatives.serviceRedirectsToGoogleOAuth: {
            return this.redirect();
        }
        case _u.alternatives.userTapsSignInButton: {
            return this.just(this.goals[_u.goals.servicePresentsSignInView]());
        }
        default: {
            throw new Error(`not implemented: ${ to.scene }`);
        }
        }
    }

    private validate(id: string | null, password: string | null): Promise<Context<SignUpScenes>> {
        const result = User.validate(id, password);
        if (result === true && id !== null && password != null) {
            return this.just(this.basics[_u.basics.onSuccessInValidatingThenServicePublishNewAccount]({ id, password }));
        } else {
            return this.just(this.goals[_u.goals.onFailureInValidatingThenServicePresentsError]({ result }));
        }
    }

    private publishNewAccount(id: string, password: string): Promise<Context<SignUpScenes>> {
        return firstValueFrom(
            User
                .create(id, password)
                .pipe(
                    map((userProperties: UserProperties) => {
                        return this.goals[_u.goals.onSuccessInPublishingThenServicePresentsHomeView]({ user: userProperties });
                    })
                )
        );
    }
    private redirect(): Promise<Context<SignUpScenes>> {
        return User
            .oauthToGoogle()
            .then(() => {
                return this.goals[_u.goals.serviceDoNothing]();
            });
    }
}