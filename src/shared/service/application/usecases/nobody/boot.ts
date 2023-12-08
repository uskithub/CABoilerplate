import { SignInStatus } from "@shared/service/domain/interfaces/authenticator";
import { Application } from "@/shared/service/domain/application/application";
import { User, UserCredential, UserProperties } from "@/shared/service/domain/authentication/user";
import { Nobody } from "../../actors/nobody";
import { MyBaseScenario } from "../common";

import type { Context, Empty, MutableContext } from "robustive-ts";
import { firstValueFrom, map } from "rxjs";


const _u = Nobody.usecases.boot;

/**
 * usecase: 起動する
 */
export type BootScenes = {
    basics: {
        [_u.basics.userOpensSite]: Empty;
        [_u.basics.serviceChecksSession]: Empty;
    };
    alternatives: {
        [_u.alternatives.sessionNotExistsThenServiceCheckGoogleOAuthRedirectResult]: Empty;
        [_u.alternatives.googleOAuthRedirectResultExistsThenServiceGetUserData]: { userCredential: UserCredential; };
    };
    goals: {
        [_u.goals.sessionExistsThenServicePresentsHome]: { user: UserProperties; };
        [_u.goals.googleOAuthRedirectResultNotExistsThenServicePresentsSignin]:Empty;
        [_u.goals.userDataExistsThenServicePerformSignInWithGoogleOAuth]: { user: UserProperties; };
        [_u.goals.userDataNotExistsThenServicePerformSignUpWithGoogleOAuth]: { userCredential: UserCredential; };
    };
};

/**
 * コンストラクタでSceneが保持するContextを設定します。
 * next関数で、一つ前のコンテキストを見て処理を分岐し、このSceneで実行した結果をContextとして保持する新たなSceneを返します。
 *
 * ※ シナリオの実装なので、分岐ロジックのみとし、ドメイン知識は持ち込まないこと
 */
export class BootScenario extends MyBaseScenario<BootScenes> {

    next(to: MutableContext<BootScenes>): Promise<Context<BootScenes>> {
        switch (to.scene) {
        case _u.basics.userOpensSite: {
            return this.just(this.basics[_u.basics.serviceChecksSession]());
        }
        case _u.basics.serviceChecksSession: {
            return this.checkSession();
        }
        case _u.alternatives.sessionNotExistsThenServiceCheckGoogleOAuthRedirectResult: {
            return this.checkGoogleOAuthRedirectResult();
        }
        case _u.alternatives.googleOAuthRedirectResultExistsThenServiceGetUserData: {
            return this.getUserData(to.userCredential as UserCredential);
        }
        default: {
            throw new Error(`not implemented: ${ to.scene }`);
        }
        }
    }

    private checkSession(): Promise<Context<BootScenes>> {
        return firstValueFrom(
            Application
                .signInStatus()
                .pipe(
                    map((signInStatus) => {
                        switch (signInStatus.case) {
                        case SignInStatus.signIn: {
                            return this.goals[_u.goals.sessionExistsThenServicePresentsHome]({ user: signInStatus.user });
                        }
                        default: {     
                            return this.alternatives[_u.alternatives.sessionNotExistsThenServiceCheckGoogleOAuthRedirectResult]();
                        }
                        }
                    })
                )
        );
    }

    private checkGoogleOAuthRedirectResult(): Promise<Context<BootScenes>> {
        return User
            .getGoogleOAuthRedirectResult()
            .then(userCredential => {
                if (userCredential === null) {
                    return this.goals[_u.goals.googleOAuthRedirectResultNotExistsThenServicePresentsSignin]();
                }
                return this.alternatives[_u.alternatives.googleOAuthRedirectResultExistsThenServiceGetUserData]( { userCredential });
            });
    }

    private getUserData(userCredential: UserCredential): Promise<Context<BootScenes>> {
        return new User(userCredential).getData()
            .then(userProperties => {
                if (userProperties === null) {
                    return this.goals[_u.goals.userDataNotExistsThenServicePerformSignUpWithGoogleOAuth]({ userCredential });
                }
                return this.goals[_u.goals.userDataExistsThenServicePerformSignInWithGoogleOAuth]({ user: userProperties });
            });
    }
}