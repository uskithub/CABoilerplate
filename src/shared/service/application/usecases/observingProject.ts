import ProjectModel from "@domain/entities/project";
import { UserProperties } from "@/shared/service/domain/authentication/user";
import { MyBaseScenario } from "./common";

import type { Context, Empty, MutableContext } from "robustive-ts";
import { map } from "rxjs";
import { Task } from "@/shared/service/domain/entities/task";

/**
 * usecase: ユーザのプロジェクトを観測する
 */
export type ObservingProjectScenes = {
    basics : {
        userSelectsAProject: { user: UserProperties; projectId: string; };
        serviceStartsObservingProjectThatMeetConditions: { user: UserProperties; projectId: string; };
    };
    alternatives: Empty;
    goals : {
        servicePresentsProjectView: { project: Task;};
        onUpdatProjectThenServiceUpdatesProjectView: { project: Task;};
    };
};

/**
 * コンストラクタでSceneが保持するContextを設定します。
 * next関数で、一つ前のコンテキストを見て処理を分岐し、このSceneで実行した結果をContextとして保持する新たなSceneを返します。
 *
 * ※ シナリオの実装なので、分岐ロジックのみとし、ドメイン知識は持ち込まないこと
 */
export class ObservingProjectScenario extends MyBaseScenario<ObservingProjectScenes> {

    next(to: MutableContext<ObservingProjectScenes>): Promise<Context<ObservingProjectScenes>> {
        switch (to.scene) {
        case this.keys.basics.userSelectsAProject: {
            return this.just(this.basics.serviceStartsObservingProjectThatMeetConditions({ user: to.user, projectId: to.projectId }));
        }
        case this.keys.basics.serviceStartsObservingProjectThatMeetConditions: {
            return this.startObservingProjectThatMeetConditions(to.user, to.projectId);
        }
        default: {
            throw new Error(`not implemented: ${ to.scene }`);
        }
        }
    }

    private startObservingProjectThatMeetConditions(user: UserProperties, projectId: string): Promise<Context<ObservingProjectScenes>> {
        let isFirst = true;
        return ProjectModel.observeProject(user.id, projectId)
            .pipe(
                map(task => {
                    if (isFirst) {
                        isFirst = false;
                        return this.goals.servicePresentsProjectView({ project: task });
                    } else {
                        return this.goals.onUpdatProjectThenServiceUpdatesProjectView({ project: task });
                    }
                })
            );
    }
}