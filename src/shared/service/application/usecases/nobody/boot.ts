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
        [_u.basics.sessionExistsThenServiceGetsUserData]: { user: UserProperties; };
    };
    alternatives: Empty;
    goals: {
        [_u.goals.userDataExistsThenServicePresentsHomeView]: { user: UserProperties; };
        [_u.goals.sessionNotExistsThenServicePresentsSignInView]:Empty;
        [_u.goals.userDataNotExistsThenServicePerformsSignUpWithGoogleOAuth]: { user: UserProperties; };
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
        case _u.basics.sessionExistsThenServiceGetsUserData: {
            return this.getUserData(to.user);
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
                            return this.basics[_u.basics.sessionExistsThenServiceGetsUserData]({ user: signInStatus.user });
                        }
                        default: {     
                            return this.goals[_u.goals.sessionNotExistsThenServicePresentsSignInView]();
                        }
                        }
                    })
                )
        );
    }

    private getUserData(user: UserProperties): Promise<Context<BootScenes>> {
        return new User(user).getData()
            .then(userProperties => {
                if (userProperties === null) {
                    return this.goals[_u.goals.userDataNotExistsThenServicePerformsSignUpWithGoogleOAuth]({ user });
                }
                return this.goals[_u.goals.userDataExistsThenServicePresentsHomeView]({ user: userProperties });
            });
    }
}