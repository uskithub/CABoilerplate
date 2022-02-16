import { AbstractScene } from "@system/interfaces/usecase";
import { Observable } from "rxjs";

/**
 * usecase: サインインする
 */
 export const enum SignOut {
    /* 基本コース */
    userStartsSignOutProcess = "ユーザはサインアウトを開始する"
    , serviceClosesSession = "サービスはセッションを終了する"
    , onSuccessThenServicePresentsSignInView = "成功した場合_サービスはサインイン画面を表示する"

    /* 代替コース */
    , onFailureThenServicePresentsError = "失敗した場合_サービスはエラーを表示する"
}

export type SignOutContext = { scene: SignOut.userStartsSignOutProcess }
    | { scene: SignOut.serviceClosesSession }
    | { scene: SignOut.onSuccessThenServicePresentsSignInView }
    | { scene: SignOut.onFailureThenServicePresentsError; error: Error; }
;

export class SignOutScene extends AbstractScene<SignOutContext> {
    context: SignOutContext;

    constructor(context: SignOutContext = { scene: SignOut.userStartsSignOutProcess }) {
        super();
        this.context = context;
    }

    next(): Observable<this>|null {
        switch (this.context.scene) {
        case SignOut.userStartsSignOutProcess: {
            // TODO
            return null;
        }
        case SignOut.serviceClosesSession : {
            // TODO
            return null;
        }
        case SignOut.onSuccessThenServicePresentsSignInView: {
            return null;
        }
        case SignOut.onFailureThenServicePresentsError: {
            return null;
        }
        }
    }
}