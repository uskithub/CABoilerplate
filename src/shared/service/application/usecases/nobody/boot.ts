import { SignInStatus } from "@shared/service/domain/interfaces/authenticator";
import { Application } from "@/shared/service/domain/application/application";
import { UserProperties } from "@/shared/service/domain/authentication/user";
import { Nobody } from ".";
import { MyBaseScenario } from "../common";

import type { Context, Empty, MutableContext } from "robustive-ts";
import { first, map, Observable } from "rxjs";

const _u = Nobody.boot;

/**
 * usecase: 起動する
 */
export type BootScenes = {
    basics: {
        [_u.basics.userOpensSite]: Empty;
        [_u.basics.serviceChecksSession]: Empty;
    };
    alternatives: Empty;
    goals: {
        [_u.goals.sessionExistsThenServicePresentsHome]: { user: UserProperties; };
        [_u.goals.sessionNotExistsThenServicePresentsSignin]: Empty;
    };
};

/**
 * コンストラクタでSceneが保持するContextを設定します。
 * next関数で、一つ前のコンテキストを見て処理を分岐し、このSceneで実行した結果をContextとして保持する新たなSceneを返します。
 *
 * ※ シナリオの実装なので、分岐ロジックのみとし、ドメイン知識は持ち込まないこと
 */
export class BootScenario extends MyBaseScenario<BootScenes> {

    next(to: MutableContext<BootScenes>): Observable<Context<BootScenes>> {
        switch (to.scene) {
        case _u.basics.userOpensSite: {
            return this.just(this.basics[_u.basics.serviceChecksSession]());
        }
        case _u.basics.serviceChecksSession: {
            return this.check();
        }
        default: {
            throw new Error(`not implemented: ${ to.scene }`);
        }
        }
    }

    private check(): Observable<Context<BootScenes>> {
        return Application
            .signInStatus()
            .pipe(
                map((signInStatus) => {
                    switch (signInStatus.case) {
                    case SignInStatus.signIn: {
                        return this.goals[_u.goals.sessionExistsThenServicePresentsHome]({ user: signInStatus.user });
                    }
                    default: {     
                        return this.goals[_u.goals.sessionNotExistsThenServicePresentsSignin]();
                    }
                    }
                })
                , first() // 一度観測したらsubscriptionを終わらせる
            );
    }
}