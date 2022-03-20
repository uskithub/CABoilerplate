import { SignInStatus } from "@shared/service/domain/interfaces/authenticator";
import ServiceModel from "@models/service";
import { User } from "@models/user";
import { Anyone, Usecase } from "robustive-ts";
import { first, map, Observable } from "rxjs";
import { IActor } from "robustive-ts/types/actor";

/**
 * usecase: アプリを起動する
 */
export const enum Boot {
    /* 基本コース */
    userOpensSite = "ユーザはサイトを開く"
    , serviceChecksSession = "サービスはセッションがあるかを確認する"
    , sessionExistsThenServicePresentsHome = "セッションがある場合_サービスはホーム画面を表示する"

    /* 代替コース */
    , sessionNotExistsThenServicePresentsSignin = "セッションがない場合_サービスはサインイン画面を表示する"
}

// 代数的データ型 @see: https://qiita.com/xmeta/items/91dfb24fa87c3a9f5993#typescript-1
export type BootContext = { scene: Boot.userOpensSite }
    | { scene: Boot.serviceChecksSession }
    | { scene: Boot.sessionExistsThenServicePresentsHome; user: User; }
    | { scene: Boot.sessionNotExistsThenServicePresentsSignin }
;

/**
 * コンストラクタでSceneが保持するContextを設定します。
 * next関数で、一つ前のコンテキストを見て処理を分岐し、このSceneで実行した結果をContextとして保持する新たなSceneを返します。
 *
 * ※ シナリオの実装なので、分岐ロジックのみとし、ドメイン知識は持ち込まないこと
 */
export class BootUsecase extends Usecase<BootContext, Anyone> {
    context: BootContext;

    constructor(context: BootContext = { scene: Boot.userOpensSite }) {
        super();
        this.context = context;
    }

    next(actor: Anyone): Observable<this>|null {
        switch (this.context.scene) {
        case Boot.userOpensSite: {
            return this.just({ scene: Boot.serviceChecksSession });
        }
        case Boot.serviceChecksSession : {
            return this.check();
        }
        case Boot.sessionExistsThenServicePresentsHome: {
            return null;
        }
        case Boot.sessionNotExistsThenServicePresentsSignin: {
            return null;
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
                        return this.instantiate({ scene: Boot.sessionExistsThenServicePresentsHome, user: signInStatusContext.user });
                    }
                    default: {
                        return this.instantiate({ scene: Boot.sessionNotExistsThenServicePresentsSignin });
                    }
                    }
                })
                , first() // 一度観測したらsubscriptionを終わらせる
            );
    }
}