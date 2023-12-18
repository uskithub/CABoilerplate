import ProjectModel from "@domain/entities/project";
import { UserProperties } from "@/shared/service/domain/authentication/user";
import { AuthorizedUser } from "../../actors/authorizedUser";
import { MyBaseScenario } from "../common";

import type { Context, Empty, MutableContext } from "robustive-ts";
import { map } from "rxjs";
import { Task } from "@/shared/service/domain/entities/task";

const _u = AuthorizedUser.usecases.observingProject;

/**
 * usecase: ユーザのプロジェクトを観測する
 */
export type ObservingProjectScenes = {
    basics : {
        [_u.basics.userSelectsAProject]: { user: UserProperties; projectId: string; };
        [_u.basics.serviceStartsObservingProjectThatMeetConditions]: { user: UserProperties; projectId: string; };
    };
    alternatives: Empty;
    goals : {
        [_u.goals.servicePresentsProjectView]: { project: Task;};
        [_u.goals.onUpdatProjectThenServiceUpdatesProjectView]: { project: Task;};
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
        case _u.basics.userSelectsAProject: {
            return this.just(this.basics[_u.basics.serviceStartsObservingProjectThatMeetConditions]({ user: to.user, projectId: to.projectId }));
        }
        case _u.basics.serviceStartsObservingProjectThatMeetConditions: {
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
                        return this.goals[_u.goals.servicePresentsProjectView]({ project: task });
                    } else {
                        return this.goals[_u.goals.onUpdatProjectThenServiceUpdatesProjectView]({ project: task });
                    }
                })
            );
    }
}