import { Application } from "@/shared/service/domain/application/application";
import TaskModel, { Task } from "@domain/entities/task";
import { UserProperties } from "@/shared/service/domain/authentication/user";
import { concat, map, Observable } from "rxjs";
import { Context, Empty, MutableContext } from "robustive-ts";
import { ChangedItem } from "../../../domain/interfaces/backend";
import { ServieceUsecases } from ".";
import { MyBaseScenario } from "../common";

const _u = ServieceUsecases.observingUsersTasks;

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
        [_u.goals.onUpdateUsersTasksThenServiceUpdateUsersTaskList]: { changedTasks: ChangedItem<Task>[] };
    };
};

/**
 * コンストラクタでSceneが保持するContextを設定します。
 * next関数で、一つ前のコンテキストを見て処理を分岐し、このSceneで実行した結果をContextとして保持する新たなSceneを返します。
 *
 * ※ シナリオの実装なので、分岐ロジックのみとし、ドメイン知識は持ち込まないこと
 */
export class ObservingUsersTasksScenario extends MyBaseScenario<ObservingUsersTasksScenes> {

    // override authorize<T extends Actor<T>>(actor: T): boolean {
    //     return Application.authorize(actor, this);
    // }

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