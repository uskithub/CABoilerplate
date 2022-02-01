import { SignInStatus } from "@/service/domain/interfaces/authenticator";
import service from "@/service/domain/models/service";
import { User } from "@/service/domain/models/user";
import { AbstractScene } from "@/system/interfaces/usecase";
import { first, map, Observable, of, single } from "rxjs";

/**
 * usecase: アプリを起動する
 */
export const enum Boot {
    /* 基本コース */
    userOpenSite = "ユーザはサイトを開く"
    , serviceCheckSession = "サービスはセッションがあるかを確認する"
    , sessionExistsThenPresentHome = "セッションがある場合_サービスはホーム画面を表示する"

    /* 代替コース */
    , sessionNotExistsThenPreesntSignin = "セッションがない場合_サービスはログイン画面を表示する"
}

// 代数的データ型 @see: https://qiita.com/xmeta/items/91dfb24fa87c3a9f5993#typescript-1
export type BootContext = { scene: Boot.userOpenSite }
    | { scene: Boot.serviceCheckSession }
    | { scene: Boot.sessionExistsThenPresentHome; user: User; }
    | { scene: Boot.sessionNotExistsThenPreesntSignin }
;

/**
 * コンストラクタでSceneが保持するContextを設定します。
 * next関数で、一つ前のコンテキストを見て処理を分岐し、このSceneで実行した結果をContextとして保持する新たなSceneを返します。
 *
 * ※ シナリオの実装なので、分岐ロジックのみとし、ドメイン知識は持ち込まないこと
 */
export class BootScene extends AbstractScene<BootContext> {
    context: BootContext;

    constructor(context: BootContext = { scene: Boot.userOpenSite }) {
        super();
        this.context = context;
    }

    private check(): Observable<this> {
        return service
            .observeSignInStatus()
            .pipe(
                map((signInStatusContext) => {
                    switch(signInStatusContext.kind) {
                        case SignInStatus.signIn: {
                            return this.instantiate({ scene: Boot.sessionExistsThenPresentHome, user: signInStatusContext.user });
                        }
                        default: {
                            return this.instantiate({ scene: Boot.sessionNotExistsThenPreesntSignin });
                        }
                    }
                })
                , first() // 一度観測したらsubscriptionを終わらせる
            );
    }

    next(): Observable<this>|null {
        switch (this.context.scene) {
        case Boot.userOpenSite: {
            return this.just({ scene: Boot.serviceCheckSession });
        }
        case Boot.serviceCheckSession : {
            return this.check();
        }
        case Boot.sessionExistsThenPresentHome: {
            return null;
        }
        case Boot.sessionNotExistsThenPreesntSignin: {
            return null;
        }
        }
    }
}