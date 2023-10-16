import ProjectModel from "@domain/entities/project";
import { UserProperties } from "@/shared/service/domain/authentication/user";
import { ChangedTask } from "@/shared/service/domain/interfaces/backend";
import { Service } from ".";
import { MyBaseScenario } from "../common";

import type { Context, Empty, MutableContext } from "robustive-ts";
import { concat, map, Observable } from "rxjs";


const _u = Service.observingUsersProjects;

/**
 * usecase: ユーザのプロジェクトを観測する
 */
export type ObservingUsersProjectsScenes = {
    basics : {
        [_u.basics.serviceDetectsSigningIn]: { user: UserProperties; };
        [_u.basics.startObservingUsersProjects]: { user: UserProperties; };
    };
    alternatives: Empty;
    goals : {
        [_u.goals.serviceDoNothing]: Empty;
        [_u.goals.onUpdateUsersProjectsThenServiceUpdateUsersProjectList]: { changedTasks: ChangedTask[] };
    };
};

/**
 * コンストラクタでSceneが保持するContextを設定します。
 * next関数で、一つ前のコンテキストを見て処理を分岐し、このSceneで実行した結果をContextとして保持する新たなSceneを返します。
 *
 * ※ シナリオの実装なので、分岐ロジックのみとし、ドメイン知識は持ち込まないこと
 */
export class ObservingUsersProjectsScenario extends MyBaseScenario<ObservingUsersProjectsScenes> {

    next(to: MutableContext<ObservingUsersProjectsScenes>): Observable<Context<ObservingUsersProjectsScenes>> {
        switch (to.scene) {
        case _u.basics.serviceDetectsSigningIn: {
            return this.just(this.basics[_u.basics.startObservingUsersProjects]({ user: to.user }));
        }
        case _u.basics.startObservingUsersProjects: {
            return this.startObservingUsersProjects(to.user);
        }
        default: {
            throw new Error(`not implemented: ${ to.scene }`);
        }
        }
    }

    private startObservingUsersProjects(user: UserProperties): Observable<Context<ObservingUsersProjectsScenes>> {
        // ユースケースの終わり（バウンダリー）に、オブザーバ（プロジェクトの観測）を結合している
        return concat(
            this.just(this.goals[_u.goals.serviceDoNothing]())
            , ProjectModel.observeUsersProjects(user.uid)
                .pipe(
                    map(changedTasks => this.goals[_u.goals.onUpdateUsersProjectsThenServiceUpdateUsersProjectList]({ changedTasks }))
                )
        );
    }
}