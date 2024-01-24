import { User, UserProperties } from "@/shared/service/domain/authentication/user";
import { ChangedTask } from "@/shared/service/domain/interfaces/backend";
import { MyBaseScenario } from "../../common";

import type { Context, Empty } from "robustive-ts";
import { Observable } from "rxjs";
import { Task } from "@/shared/service/domain/taskManagement/task";

/**
 * usecase: ユーザのタスクを観測する
 */
export type ObservingUsersTasksScenes = {
    basics : {
        serviceGetsUsersTasksObservable: { user: UserProperties; };
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

    next(to: Context<ObservingUsersTasksScenes>): Promise<Context<ObservingUsersTasksScenes>> {
        switch (to.scene) {
        case this.keys.basics.serviceGetsUsersTasksObservable: {
            return this.getUsersTasksObservable(to.user);
        }
        default: {
            throw new Error(`not implemented: ${ to.scene }`);
        }
        }
    }

    private getUsersTasksObservable(user: UserProperties): Promise<Context<ObservingUsersTasksScenes>> {
        const observable = new User(user).tasksObservable;
        return this.just(this.goals.serviceStartsObservingUsersTasks({ observable }));
    }
}