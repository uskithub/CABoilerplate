import ServiceModel from "@models/service";
import TaskModel, { Task } from "@models/task";
import { User } from "@models/user";
import { concat, map, Observable } from "rxjs";
import { Actor, Boundary, boundary, ContextualizedScenes, Empty, Usecase } from "robustive-ts";
import { ChangedItem } from "../../../domain/interfaces/backend";

/**
 * usecase: アプリを起動する
 */
export const scenes = {
    /* Basic Courses */
    serviceDetectsSigningIn : "サービスはユーザのサインインを検知する"
    , startObservingUsersTasks : "サービスはユーザのタスクの観測を開始する"

    /* Boundaries */
    , goals : {
        serviceDoNothing : "サービスは何もしない"
        , onUpdateUsersTasksThenServiceUpdateUsersTaskList : "ユーザのタスクが更新された時_サービスはユーザのタスク一覧を更新する"
    }
} as const;

type ObservingUsersTasks = typeof scenes[keyof typeof scenes];

// 代数的データ型 @see: https://qiita.com/xmeta/items/91dfb24fa87c3a9f5993#typescript-1
// https://zenn.dev/eagle/articles/ts-coproduct-introduction
export type Goals = ContextualizedScenes<{
    [scenes.goals.serviceDoNothing]: Empty;
    [scenes.goals.onUpdateUsersTasksThenServiceUpdateUsersTaskList]: { changedTasks: ChangedItem<Task>[] };
}>;

export type Scenes = ContextualizedScenes<{
    [scenes.serviceDetectsSigningIn]: { user: User; };
    [scenes.startObservingUsersTasks]: { user: User; };
}> | Goals;

export const isObservingUsersTasksGoal = (context: any): context is Goals => context.scene !== undefined && Object.values(scenes.goals).find(c => { return c === context.scene; }) !== undefined;
export const isObservingUsersTasksScene = (context: any): context is Scenes => context.scene !== undefined && Object.values(scenes).find(c => { return c === context.scene; }) !== undefined;

export const ObservingUsersTasks = scenes;
export type ObservingUsersTasksGoals = Goals;
export type ObservingUsersTasksScenes = Scenes;

/**
 * コンストラクタでSceneが保持するContextを設定します。
 * next関数で、一つ前のコンテキストを見て処理を分岐し、このSceneで実行した結果をContextとして保持する新たなSceneを返します。
 *
 * ※ シナリオの実装なので、分岐ロジックのみとし、ドメイン知識は持ち込まないこと
 */
export class ObservingUsersTasksUsecase extends Usecase<Scenes> {

    override authorize<T extends Actor<T>>(actor: T): boolean {
        return ServiceModel.authorize(actor, this);
    }

    next(): Observable<this>|Boundary {
        switch (this.context.scene) {
        case scenes.serviceDetectsSigningIn: {
            return this.just({ scene: scenes.startObservingUsersTasks, user: this.context.user });
        }
        case scenes.startObservingUsersTasks: {
            return this.startObservingUsersTasks(this.context.user);
        }
        case scenes.goals.serviceDoNothing:
        case scenes.goals.onUpdateUsersTasksThenServiceUpdateUsersTaskList: {
            return boundary;
        }
        }
    }

    private startObservingUsersTasks(user: User): Observable<this> {
        // ユースケースの終わり（バウンダリー）に、オブザーバ（タスクの観測）を結合している
        return concat(
            this.just({ scene: scenes.goals.serviceDoNothing }) 
            , TaskModel.observeUserTasks(user.uid)
                .pipe(
                    map(changedTasks =>
                        this.instantiate({ scene: scenes.goals.onUpdateUsersTasksThenServiceUpdateUsersTaskList, changedTasks })
                    )
                )
        );
    }
}