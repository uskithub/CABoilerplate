import { SignInStatus } from "@shared/service/domain/interfaces/authenticator";
import { Application } from "@/shared/service/domain/application/application";
import { Task } from "@domain/entities/task";
import { UserProperties } from "@/shared/service/domain/authentication/user";
import { first, map, Observable } from "rxjs";
import { Actor, BaseScenario, Context, Empty } from "robustive-ts";
import { ChangedItem } from "../../../domain/interfaces/backend";
import { NobodyUsecases } from ".";

const _u = NobodyUsecases.boot;

/**
 * usecase: 起動する
 */
export type BootScenes = {
    basics: {
        [_u.basics.userOpensSite]: Empty;
        [_u.basics.serviceChecksSession]: Empty;
    };
    alternatives: Empty;
    goals: {
        [_u.goals.sessionExistsThenServicePresentsHome]: { user: UserProperties; };
        [_u.goals.sessionNotExistsThenServicePresentsSignin]: Empty;
        [_u.goals.onUpdateUsersTasksThenServiceUpdateUsersTaskList]: { changedTasks: ChangedItem<Task>[] };
    };
};

/**
 * コンストラクタでSceneが保持するContextを設定します。
 * next関数で、一つ前のコンテキストを見て処理を分岐し、このSceneで実行した結果をContextとして保持する新たなSceneを返します。
 *
 * ※ シナリオの実装なので、分岐ロジックのみとし、ドメイン知識は持ち込まないこと
 */
export class BootScenario extends BaseScenario<BootScenes> {

    next(to: Context<BootScenes>): Observable<Context<BootScenes>> {
        switch (to.scene) {
        case _u.basics.userOpensSite: {
            console.log("%%%", this);
            return this.just(this.basics[_u.basics.serviceChecksSession]());
        }
        case _u.basics.serviceChecksSession: {
            return this.check();
        }
        default: {
            throw new Error(`not implemented: ${ to.scene }`);
        }
        }
    }

    private check(): Observable<Context<BootScenes>> {
        return Application
            .signInStatus()
            .pipe(
                map((signInStatusContext) => {
                    switch (signInStatusContext.kind) {
                    case SignInStatus.signIn: {
                        return this.goals[_u.goals.sessionExistsThenServicePresentsHome]({ user: signInStatusContext.user });
                    }
                    default: {     
                        return this.goals[_u.goals.sessionNotExistsThenServicePresentsSignin]();
                    }
                    }
                })
                , first() // 一度観測したらsubscriptionを終わらせる
            );
    }

    // private startObservingUsersTasks(user: User): Observable<this> {
    //     // ユースケースの終わり（バウンダリー）に、オブザーバ（タスクの観測）を結合している
    //     return concat(
    //         this.just({ scene: scenes.goals.servicePresentsHome, user: user }) as Observable<this>
    //         , TaskModel.observeUserTasks(user.uid)
    //             .pipe(
    //                 map(changedTasks =>
    //                     this.instantiate({ scene: scenes.goals.onUpdateUsersTasksThenServiceUpdateUsersTaskList, changedTasks })
    //                 )
    //             )
    //     );
    // }
}