import { SignInStatus } from "@shared/service/domain/interfaces/authenticator";
import ServiceModel from "@models/service";
import { User } from "@models/user";
import { first, map, Observable } from "rxjs";
import { Boundary, boundary, Empty, Usecase, UsecaseScenario } from "robustive-ts";

/**
 * usecase: アプリを起動する
 */
export const Boot = {
    /* Basic Courses */
    userOpensSite : "ユーザはサイトを開く"
    , serviceChecksSession : "サービスはセッションがあるかを確認する"

    /* Boundaries */
    , goals : {
        sessionExistsThenServicePresentsHome : "セッションがある場合_サービスはホーム画面を表示する"
        , sessionNotExistsThenServicePresentsSignin : "セッションがない場合_サービスはサインイン画面を表示する"
    }
} as const;

type Boot = typeof Boot[keyof typeof Boot];

// 代数的データ型 @see: https://qiita.com/xmeta/items/91dfb24fa87c3a9f5993#typescript-1
// https://zenn.dev/eagle/articles/ts-coproduct-introduction
export type BootGoal = UsecaseScenario<{
    [Boot.goals.sessionExistsThenServicePresentsHome]: { user: User; };
    [Boot.goals.sessionNotExistsThenServicePresentsSignin]: Empty;
}>;

export type BootScenario = UsecaseScenario<{
    [Boot.userOpensSite]: Empty;
    [Boot.serviceChecksSession]: Empty;
}> | BootGoal;

export const isBootGoal = (context: BootScenario): context is BootGoal => context.scene !== undefined && Object.values(Boot.goals).find(c => { return c === context.scene; }) !== undefined;

/**
 * コンストラクタでSceneが保持するContextを設定します。
 * next関数で、一つ前のコンテキストを見て処理を分岐し、このSceneで実行した結果をContextとして保持する新たなSceneを返します。
 *
 * ※ シナリオの実装なので、分岐ロジックのみとし、ドメイン知識は持ち込まないこと
 */
export class BootUsecase extends Usecase<BootScenario> {

    constructor(initialContext: BootScenario = { scene: Boot.userOpensSite }) {
        super(initialContext);
    }

    next(): Observable<this>|Boundary {
        switch (this.context.scene) {
        case Boot.userOpensSite: {
            return this.just({ scene: Boot.serviceChecksSession });
        }
        case Boot.serviceChecksSession : {
            return this.check();
        }
        case Boot.goals.sessionExistsThenServicePresentsHome:
        case Boot.goals.sessionNotExistsThenServicePresentsSignin: {
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
                        return this.instantiate({ scene: Boot.goals.sessionExistsThenServicePresentsHome, user: signInStatusContext.user });
                    }
                    default: {
                        return this.instantiate({ scene: Boot.goals.sessionNotExistsThenServicePresentsSignin });
                    }
                    }
                })
                , first() // 一度観測したらsubscriptionを終わらせる
            );
    }
}