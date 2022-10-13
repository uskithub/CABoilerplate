import { SignInStatus } from "@shared/service/domain/interfaces/authenticator";
import ServiceModel from "@models/service";
import TaskModel, { Task } from "@models/task";
import { User } from "@models/user";
import { concat, first, map, Observable } from "rxjs";
import { Actor, Boundary, boundary, Empty, Usecase, UsecaseScenario } from "robustive-ts";
import { ChangedItem } from "../../domain/interfaces/backend";

/**
 * usecase: アプリを起動する
 */
export const Boot = {
    /* Basic Courses */
    userOpensSite : "ユーザはサイトを開く"
    , serviceChecksSession : "サービスはセッションがあるかを確認する"
    , sessionExistsThenServiceStartObservingUsersTasks : "セッションがある場合_サービスはユーザのタスクの観測を開始する"

    /* Boundaries */
    , goals : {
        servicePresentsHome : "サービスはホーム画面を表示する"
        , sessionNotExistsThenServicePresentsSignin : "セッションがない場合_サービスはサインイン画面を表示する"
        , onUpdateUsersThenServiceUpdateUsersTaskList : "ユーザのタスクが更新された時_サービスはユーザのタスク一覧を更新する"
    }
} as const;

type Boot = typeof Boot[keyof typeof Boot];

// 代数的データ型 @see: https://qiita.com/xmeta/items/91dfb24fa87c3a9f5993#typescript-1
// https://zenn.dev/eagle/articles/ts-coproduct-introduction
export type BootGoal = UsecaseScenario<{
    [Boot.goals.servicePresentsHome]: { user: User; };
    [Boot.goals.sessionNotExistsThenServicePresentsSignin]: Empty;
    [Boot.goals.onUpdateUsersThenServiceUpdateUsersTaskList]: { changedTasks: ChangedItem<Task>[] };
}>;

export type BootScenario = UsecaseScenario<{
    [Boot.userOpensSite]: Empty;
    [Boot.serviceChecksSession]: Empty;
    [Boot.sessionExistsThenServiceStartObservingUsersTasks]: { user: User; };
}> | BootGoal;

export const isBootGoal = (context: any): context is BootGoal => context.scene !== undefined && Object.values(Boot.goals).find(c => { return c === context.scene; }) !== undefined;
export const isBootScene = (context: any): context is BootScenario => context.scene !== undefined && Object.values(Boot).find(c => { return c === context.scene; }) !== undefined;

/**
 * コンストラクタでSceneが保持するContextを設定します。
 * next関数で、一つ前のコンテキストを見て処理を分岐し、このSceneで実行した結果をContextとして保持する新たなSceneを返します。
 *
 * ※ シナリオの実装なので、分岐ロジックのみとし、ドメイン知識は持ち込まないこと
 */
export class BootUsecase extends Usecase<BootScenario> {

    override authorize<T extends Actor<T>>(actor: T): boolean {
        return ServiceModel.authorize(actor, this);
    }

    next(): Observable<this>|Boundary {
        switch (this.context.scene) {
        case Boot.userOpensSite: {
            return this.just({ scene: Boot.serviceChecksSession });
        }
        case Boot.serviceChecksSession : {
            return this.check();
        }
        case Boot.sessionExistsThenServiceStartObservingUsersTasks : {
            return this.startObservingUsersTasks(this.context.user);
        }
        case Boot.goals.servicePresentsHome:
        case Boot.goals.sessionNotExistsThenServicePresentsSignin:
        case Boot.goals.onUpdateUsersThenServiceUpdateUsersTaskList: {
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
                        return this.instantiate({ scene: Boot.sessionExistsThenServiceStartObservingUsersTasks, user: signInStatusContext.user });
                    }
                    default: {
                        return this.instantiate({ scene: Boot.goals.sessionNotExistsThenServicePresentsSignin });
                    }
                    }
                })
                , first() // 一度観測したらsubscriptionを終わらせる
            );
    }

    private startObservingUsersTasks(user: User): Observable<this> {
        // ユースケースの終わり（バウンダリー）に、オブザーバ（タスクの観測）を結合している
        return concat(
            this.just({ scene: Boot.goals.servicePresentsHome, user: user }) as Observable<this>
            , TaskModel.observeUserTasks(user.uid)
                .pipe(
                    map(changedTasks =>
                        this.instantiate({ scene: Boot.goals.onUpdateUsersThenServiceUpdateUsersTaskList, changedTasks })
                    )
                )
        );
    }
}