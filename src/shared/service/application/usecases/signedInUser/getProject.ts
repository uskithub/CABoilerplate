import ProjectModel from "@domain/entities/project";
import { UserProperties } from "@/shared/service/domain/authentication/user";
import { SignInUser } from ".";
import { MyBaseScenario } from "../common";

import type { Context, Empty, MutableContext } from "robustive-ts";
import { concat, map, Observable } from "rxjs";


const _u = SignInUser.getProject;

/**
 * usecase: アプリを起動する
 */
export type GetProjectScenes = {
    basics : {
        [_u.basics.userSelectsAProject]: { user: UserProperties; projectId: string; };
        [_u.basics.serviceGetsProjectThatMeetConditions]: { user: UserProperties; projectId: string; };
    };
    alternatives: Empty;
    goals : {
        [_u.goals.servicePresentsProjectView]: { project: TaskModel;};
    };
};

/**
 * コンストラクタでSceneが保持するContextを設定します。
 * next関数で、一つ前のコンテキストを見て処理を分岐し、このSceneで実行した結果をContextとして保持する新たなSceneを返します。
 *
 * ※ シナリオの実装なので、分岐ロジックのみとし、ドメイン知識は持ち込まないこと
 */
export class GetProjectScenario extends MyBaseScenario<OGetProjectScenes> {

    next(to: MutableContext<GetProjectScenes>): Observable<Context<GetProjectScenes>> {
        switch (to.scene) {
        case _u.basics.userSelectsAProject: {
            return this.just(this.basics[_u.basics.serviceGetsProjectThatMeetConditions]({ user: to.user, projectId: to.projectId }));
        }
        case _u.basics.serviceGetsProjectThatMeetConditions: {
            return this.getsProjectThatMeetConditions(to.user, to.projectId);
        }
        default: {
            throw new Error(`not implemented: ${ to.scene }`);
        }
        }
    }

    private getsProjectThatMeetConditions(user: UserProperties, projectId: string): Observable<Context<GetProjectScenes>> {
        // ユースケースの終わり（バウンダリー）に、オブザーバ（タスクの観測）を結合している
        return concat(
            this.just(this.goals[_u.goals.servicePresentsProjectView]())
            , ProjectModel.observeProjects(user.uid)
                .pipe(
                    map(changedTasks => this.goals[_u.goals.onUpdateUsersTasksThenServiceUpdateUsersTaskList]({ changedTasks }))
                )
        );
    }
}