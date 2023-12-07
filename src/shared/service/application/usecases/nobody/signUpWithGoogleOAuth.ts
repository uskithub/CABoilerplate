import { User, type SignUpValidationResult, type UserProperties } from "@/shared/service/domain/authentication/user";
import { Nobody } from "../../actors/nobody";
import { MyBaseScenario } from "../common";

import type { Context, Empty, MutableContext } from "robustive-ts";
import { firstValueFrom, map } from "rxjs";

const _u = Nobody.usecases.signUpWithGoogleOAuth;

/**
 * usecase: サインアップする
 */
export type SignUpWithGoogleOAuthScenes = {
    basics: {
        [_u.basics.userStartsSignUpProcess]: Empty;
        [_u.basics.systemRedirectsToGoogleOAuth]: Empty;
        [_u.basics.userAuthenticatesWithGoogle]: Empty;
        [_u.basics.systemReceivesAuthToken]: Empty;
    };
    goals: {
        [_u.goals.systemDisplaysHomepage]: Empty;
    };
    alternatives: {
        [_u.alternatives.errorDuringGoogleOAuth]: Empty;
        [_u.alternatives.systemDisplaysErrorAndRedirects]: Empty;
    };
};

export class SignUpWithGoogleOAuthScenario extends MyBaseScenario<SignUpWithGoogleOAuthScenes> {

    next(to: MutableContext<SignUpWithGoogleOAuthScenes>): Promise<Context<SignUpWithGoogleOAuthScenes>> {
        switch (to.scene) {
        case _u.basics.userStartsSignUpProcess: {
            return this.just(this.basics[_u.basics.systemRedirectsToGoogleOAuth]());
        }
        case _u.basics.systemRedirectsToGoogleOAuth: {
            return this.redirect();
        }
        case _u.basics.onSuccessInValidatingThenServicePublishNewAccount: {
            return this.publishNewAccount(to.id, to.password);
        }
        case _u.alternatives.userTapsSignInButton: {
            return this.just(this.goals[_u.goals.servicePresentsSignInView]());
        }
        default: {
            throw new Error(`not implemented: ${ to.scene }`);
        }
        }
    }

    private redirect(): Promise<Context<SignUpWithGoogleOAuthScenes>> {
        return firstValueFrom(
            User
                .oauthToGoogle()
                .pipe(
                    map(() => {
                        return this.goals[_u.goals.systemDisplaysHomepage]();
                    })
                )
        );
        // if (result === true && id !== null && password != null) {
        //     return this.just(this.basics[_u.basics.onSuccessInValidatingThenServicePublishNewAccount]({ id, password }));
        // } else {
        //     return this.just(this.goals[_u.goals.onFailureInValidatingThenServicePresentsError]({ result }));
        // }
    }
}