import TaskModel from "@domain/entities/task";
import { UserProperties } from "@/shared/service/domain/authentication/user";
import { ChangedTask } from "@/shared/service/domain/interfaces/backend";
import { Service } from ".";
import { MyBaseScenario } from "../common";

import type { Context, Empty, MutableContext } from "robustive-ts";
import { concat, map, Observable } from "rxjs";


const _u = Service.observingUsersTasks;

/**
 * usecase: アプリを起動する
 */
export type ObservingUsersTasksScenes = {
    basics : {
        [_u.basics.serviceDetectsSigningIn]: { user: UserProperties; };
        [_u.basics.startObservingUsersTasks]: { user: UserProperties; };
    };
    alternatives: Empty;
    goals : {
        [_u.goals.serviceDoNothing]: Empty;
        [_u.goals.onUpdateUsersTasksThenServiceUpdateUsersTaskList]: { changedTasks: ChangedTask[] };
    };
};

/**
 * コンストラクタでSceneが保持するContextを設定します。
 * next関数で、一つ前のコンテキストを見て処理を分岐し、このSceneで実行した結果をContextとして保持する新たなSceneを返します。
 *
 * ※ シナリオの実装なので、分岐ロジックのみとし、ドメイン知識は持ち込まないこと
 */
export class ObservingUsersTasksScenario extends MyBaseScenario<ObservingUsersTasksScenes> {

    next(to: MutableContext<ObservingUsersTasksScenes>): Observable<Context<ObservingUsersTasksScenes>> {
        switch (to.scene) {
        case _u.basics.serviceDetectsSigningIn: {
            return this.just(this.basics[_u.basics.startObservingUsersTasks]({ user: to.user }));
        }
        case _u.basics.startObservingUsersTasks: {
            return this.startObservingUsersTasks(to.user);
        }
        default: {
            throw new Error(`not implemented: ${ to.scene }`);
        }
        }
    }

    private startObservingUsersTasks(user: UserProperties): Observable<Context<ObservingUsersTasksScenes>> {
        // ユースケースの終わり（バウンダリー）に、オブザーバ（タスクの観測）を結合している
        return concat(
            this.just(this.goals[_u.goals.serviceDoNothing]())
            , TaskModel.observeUserTasks(user.uid)
                .pipe(
                    map(changedTasks => this.goals[_u.goals.onUpdateUsersTasksThenServiceUpdateUsersTaskList]({ changedTasks }))
                )
        );
    }
}