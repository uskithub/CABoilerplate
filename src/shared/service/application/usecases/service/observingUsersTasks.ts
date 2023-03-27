import { SignInStatus } from "@shared/service/domain/interfaces/authenticator";
import ServiceModel from "@models/service";
import TaskModel, { Task } from "@models/task";
import { User } from "@models/user";
import { concat, first, map, Observable } from "rxjs";
import { Actor, Boundary, boundary, Empty, Usecase, UsecaseScenario } from "robustive-ts";
import { ChangedItem } from "../../../domain/interfaces/backend";

/**
 * usecase: アプリを起動する
 */
export const ObservingUsersTasks = {
    /* Basic Courses */
    serviceDetectsSigningIn : "サービスはユーザのサインインを検知する"
    , startObservingUsersTasks : "サービスはユーザのタスクの観測を開始する"

    /* Boundaries */
    , goals : {
        serviceDoNothing : "サービスは何もしない"
        , onUpdateUsersTasksThenServiceUpdateUsersTaskList : "ユーザのタスクが更新された時_サービスはユーザのタスク一覧を更新する"
    }
} as const;

type ObservingUsersTasks = typeof ObservingUsersTasks[keyof typeof ObservingUsersTasks];

// 代数的データ型 @see: https://qiita.com/xmeta/items/91dfb24fa87c3a9f5993#typescript-1
// https://zenn.dev/eagle/articles/ts-coproduct-introduction
export type ObservingUsersTasksGoal = UsecaseScenario<{
    [ObservingUsersTasks.goals.serviceDoNothing]: Empty;
    [ObservingUsersTasks.goals.onUpdateUsersTasksThenServiceUpdateUsersTaskList]: { changedTasks: ChangedItem<Task>[] };
}>;

export type ObservingUsersTasksScenario = UsecaseScenario<{
    [ObservingUsersTasks.serviceDetectsSigningIn]: { user: User; };
    [ObservingUsersTasks.startObservingUsersTasks]: { user: User; };
}> | ObservingUsersTasksGoal;

export const isObservingUsersTasksGoal = (context: any): context is ObservingUsersTasksGoal => context.scene !== undefined && Object.values(ObservingUsersTasks.goals).find(c => { return c === context.scene; }) !== undefined;
export const isObservingUsersTasksScene = (context: any): context is ObservingUsersTasksScenario => context.scene !== undefined && Object.values(ObservingUsersTasks).find(c => { return c === context.scene; }) !== undefined;

/**
 * コンストラクタでSceneが保持するContextを設定します。
 * next関数で、一つ前のコンテキストを見て処理を分岐し、このSceneで実行した結果をContextとして保持する新たなSceneを返します。
 *
 * ※ シナリオの実装なので、分岐ロジックのみとし、ドメイン知識は持ち込まないこと
 */
export class ObservingUsersTasksUsecase extends Usecase<ObservingUsersTasksScenario> {

    override authorize<T extends Actor<T>>(actor: T): boolean {
        return ServiceModel.authorize(actor, this);
    }

    next(): Observable<this>|Boundary {
        switch (this.context.scene) {
        case ObservingUsersTasks.serviceDetectsSigningIn: {
            return this.just({ scene: ObservingUsersTasks.startObservingUsersTasks, user: this.context.user });
        }
        case ObservingUsersTasks.startObservingUsersTasks: {
            return this.startObservingUsersTasks(this.context.user);
        }
        case ObservingUsersTasks.goals.serviceDoNothing:
        case ObservingUsersTasks.goals.onUpdateUsersTasksThenServiceUpdateUsersTaskList: {
            return boundary;
        }
        }
    }

    private startObservingUsersTasks(user: User): Observable<this> {
        // ユースケースの終わり（バウンダリー）に、オブザーバ（タスクの観測）を結合している
        return concat(
            this.just({ scene: ObservingUsersTasks.goals.serviceDoNothing }) as Observable<this>
            , TaskModel.observeUserTasks(user.uid)
                .pipe(
                    map(changedTasks =>
                        this.instantiate({ scene: ObservingUsersTasks.goals.onUpdateUsersTasksThenServiceUpdateUsersTaskList, changedTasks })
                    )
                )
        );
    }
}