import TaskModel from "@domain/entities/task";
import { UserProperties } from "@/shared/service/domain/authentication/user";
import { ChangedTask } from "@/shared/service/domain/interfaces/backend";
import { Service } from "../../actors/service";
import { MyBaseScenario } from "../common";

import type { Context, Empty, MutableContext } from "robustive-ts";
import { Observable } from "rxjs";


const _u = Service.usecases.observingUsersTasks;

/**
 * usecase: ユーザのタスクを観測する
 */
export type ObservingUsersTasksScenes = {
    basics : {
        [_u.basics.serviceDetectsSigningIn]: { user: UserProperties; };
    };
    alternatives: Empty;
    goals : {
        [_u.goals.serviceStartsObservingUsersTasks]: { observable: Observable<ChangedTask[]> };
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
        case _u.basics.serviceDetectsSigningIn: {
            const observable = TaskModel.observeUsersTasks(to.user.uid);
            return this.just(this.goals[_u.goals.serviceStartsObservingUsersTasks]({ observable }));
        }
        default: {
            throw new Error(`not implemented: ${ to.scene }`);
        }
        }
    }
}