import { SignInStatus } from "@shared/service/domain/interfaces/authenticator";
import { Application } from "@/shared/service/domain/application/application";
import TaskModel, { Task } from "@domain/entities/task";
import { UserProperties } from "@/shared/service/domain/authentication/user";
import { concat, first, map, Observable } from "rxjs";
import { Actor, Boundary, boundary, Context, Empty, Usecase } from "robustive-ts";
import { ChangedItem } from "../../../domain/interfaces/backend";

/**
 * usecase: アプリを起動する
 */
const scenes = {
    /* Basic Courses */
    userOpensSite : "ユーザはサイトを開く"
    , serviceChecksSession : "サービスはセッションがあるかを確認する"

    /* Boundaries */
    , goals : {
        sessionExistsThenServicePresentsHome : "セッションがある場合_サービスはホーム画面を表示する"
        , sessionNotExistsThenServicePresentsSignin : "セッションがない場合_サービスはサインイン画面を表示する"
        , onUpdateUsersTasksThenServiceUpdateUsersTaskList : "ユーザのタスクが更新された時_サービスはユーザのタスク一覧を更新する"
    }
} as const;

type Boot = typeof scenes[keyof typeof scenes];

// 代数的データ型 @see: https://qiita.com/xmeta/items/91dfb24fa87c3a9f5993#typescript-1
// https://zenn.dev/eagle/articles/ts-coproduct-introduction
type Goals = Context<{
    [scenes.goals.sessionExistsThenServicePresentsHome]: { user: UserProperties; };
    [scenes.goals.sessionNotExistsThenServicePresentsSignin]: Empty;
    [scenes.goals.onUpdateUsersTasksThenServiceUpdateUsersTaskList]: { changedTasks: ChangedItem<Task>[] };
}>;

type Scenes = Context<{
    [scenes.userOpensSite]: Empty;
    [scenes.serviceChecksSession]: Empty;
    // [Boot.sessionExistsThenPerformObservingUsersTasks]: { user: User; };
}> | Goals;

export const isBootGoal = (context: any): context is Goals => context.scene !== undefined && Object.values(scenes.goals).find(c => { return c === context.scene; }) !== undefined;
export const isBootScene = (context: any): context is Scenes => context.scene !== undefined && Object.values(scenes).find(c => { return c === context.scene; }) !== undefined;

export const Boot = scenes;
export type BootGoals = Goals;
export type BootScenes = Scenes;

/**
 * コンストラクタでSceneが保持するContextを設定します。
 * next関数で、一つ前のコンテキストを見て処理を分岐し、このSceneで実行した結果をContextとして保持する新たなSceneを返します。
 *
 * ※ シナリオの実装なので、分岐ロジックのみとし、ドメイン知識は持ち込まないこと
 */
export class BootUsecase extends Usecase<Scenes> {

    override authorize<T extends Actor<T>>(actor: T): boolean {
        return ServiceModel.authorize(actor, this);
    }

    next(): Observable<this>|Boundary {
        switch (this.context.scene) {
        case scenes.userOpensSite: {
            return this.just({ scene: Boot.serviceChecksSession });
        }
        case scenes.serviceChecksSession : {
            return this.check();
        }
        case scenes.goals.sessionExistsThenServicePresentsHome:
        case scenes.goals.sessionNotExistsThenServicePresentsSignin:
        case scenes.goals.onUpdateUsersTasksThenServiceUpdateUsersTaskList: {
            return boundary;
        }
        }
    }

    private check(): Observable<this> {
        return ServiceModel
            .signInStatus()
            .pipe(
                map((signInStatusContext) => {
                    switch(signInStatusContext.kind) {
                    case SignInStatus.signIn: {
                        return this.instantiate({ scene: scenes.goals.sessionExistsThenServicePresentsHome, user: signInStatusContext.user });
                    }
                    default: {
                        return this.instantiate({ scene: scenes.goals.sessionNotExistsThenServicePresentsSignin });
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