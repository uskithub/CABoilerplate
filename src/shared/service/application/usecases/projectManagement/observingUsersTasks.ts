import TaskModel from "@domain/projectManagement/task";
import { UserProperties } from "@/shared/service/domain/authentication/user";
import { ChangedTask } from "@/shared/service/domain/interfaces/backend";
import { MyBaseScenario } from "../../common";

import type { Context, Empty, MutableContext } from "robustive-ts";
import { Observable } from "rxjs";

/**
 * usecase: ユーザのタスクを観測する
 */
export type ObservingUsersTasksScenes = {
    basics : {
        serviceDetectsSigningIn: { user: UserProperties; };
    };
    alternatives: Empty;
    goals : {
        serviceStartsObservingUsersTasks: { observable: Observable<ChangedTask[]> };
    };
};

/**
 * コンストラクタでSceneが保持するContextを設定します。
 * next関数で、一つ前のコンテキストを見て処理を分岐し、このSceneで実行した結果をContextとして保持する新たなSceneを返します。
 *
 * ※ シナリオの実装なので、分岐ロジックのみとし、ドメイン知識は持ち込まないこと
 */
export class ObservingUsersTasksScenario extends MyBaseScenario<ObservingUsersTasksScenes> {

    next(to: MutableContext<ObservingUsersTasksScenes>): Promise<Context<ObservingUsersTasksScenes>> {
        switch (to.scene) {
        case this.keys.basics.serviceDetectsSigningIn: {
            const observable = TaskModel.observeUsersTasks(to.user.id);
            return this.just(this.goals.serviceStartsObservingUsersTasks({ observable }));
        }
        default: {
            throw new Error(`not implemented: ${ to.scene }`);
        }
        }
    }
}