import { UserProperties } from "@/shared/service/domain/authentication/user";
import { ChangedConduct } from "@/shared/service/domain/interfaces/backend";
import { Conduct } from "@/shared/service/domain/timeline/conduct";
import { MyBaseScenario } from "../../common";

import type { Context, Empty } from "robustive-ts";
import { Observable } from "rxjs";

/**
 * usecase: ユーザのプロジェクトを観測する
 */
export type ObservingUsersTimelineScenes = {
    basics : {
        serviceDetectsSigningIn: { user: UserProperties; };
    };
    alternatives: Empty;
    goals : {
        startObservingUsersTimeline: { timelineObservable: Observable<ChangedConduct[]> };
    };
};

/**
 * コンストラクタでSceneが保持するContextを設定します。
 * next関数で、一つ前のコンテキストを見て処理を分岐し、このSceneで実行した結果をContextとして保持する新たなSceneを返します。
 *
 * ※ シナリオの実装なので、分岐ロジックのみとし、ドメイン知識は持ち込まないこと
 */
export class ObservingUsersTimelineScenario extends MyBaseScenario<ObservingUsersTimelineScenes> {

    next(to: Context<ObservingUsersTimelineScenes>): Promise<Context<ObservingUsersTimelineScenes>> {
        switch (to.scene) {
        case this.keys.basics.serviceDetectsSigningIn: {
            // TODO: 引数が適当なので、適切なものに変更する
            const timelineObservable = Conduct.getObservavle(to.user.id);
            return this.just(this.goals.startObservingUsersTimeline({ timelineObservable }));
        }
        default: {
            throw new Error(`not implemented: ${ to.scene }`);
        }
        }
    }
}