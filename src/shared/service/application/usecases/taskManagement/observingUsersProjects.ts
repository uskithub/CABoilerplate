import ProjectModel from "@domain/entities/project";
import { UserProperties } from "@/shared/service/domain/authentication/user";
import { ChangedTask } from "@/shared/service/domain/interfaces/backend";
import { MyBaseScenario } from "../../common";

import type { Context, Empty } from "robustive-ts";
import { Observable } from "rxjs";

/**
 * usecase: ユーザのプロジェクトを観測する
 */
export type ObservingUsersProjectsScenes = {
    basics : {
        serviceDetectsSigningIn: { user: UserProperties; };
    };
    alternatives: Empty;
    goals : {
        startObservingUsersProjects: { observable: Observable<ChangedTask[]> };
    };
};

/**
 * コンストラクタでSceneが保持するContextを設定します。
 * next関数で、一つ前のコンテキストを見て処理を分岐し、このSceneで実行した結果をContextとして保持する新たなSceneを返します。
 *
 * ※ シナリオの実装なので、分岐ロジックのみとし、ドメイン知識は持ち込まないこと
 */
export class ObservingUsersProjectsScenario extends MyBaseScenario<ObservingUsersProjectsScenes> {

    next(to: Context<ObservingUsersProjectsScenes>): Promise<Context<ObservingUsersProjectsScenes>> {
        switch (to.scene) {
        case this.keys.basics.serviceDetectsSigningIn: {
            const observable = ProjectModel.observeUsersProjects(to.user.id);
            return this.just(this.goals.startObservingUsersProjects({ observable }));
        }
        default: {
            throw new Error(`not implemented: ${ to.scene }`);
        }
        }
    }
}