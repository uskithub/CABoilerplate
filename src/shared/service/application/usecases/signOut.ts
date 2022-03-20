import { SignedInUser } from "@/client/service/application/actors/signedInUser";
import UserModel from "@models/user";
import { Usecase } from "robustive-ts";
import { catchError, map, Observable, of } from "rxjs";

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

export class SignOutUsecase extends Usecase<SignOutContext, SignedInUser> {
    context: SignOutContext;

    constructor(context: SignOutContext = { scene: SignOut.userStartsSignOutProcess }) {
        super();
        this.context = context;
    }

    next(actor: SignedInUser): Observable<this>|null {
        switch (this.context.scene) {
        case SignOut.userStartsSignOutProcess: {
            return this.just({ scene: SignOut.serviceClosesSession });
        }
        case SignOut.serviceClosesSession : {
            return this.signOut();
        }
        case SignOut.onSuccessThenServicePresentsSignInView: {
            return null;
        }
        case SignOut.onFailureThenServicePresentsError: {
            return null;
        }
        }
    }

    private signOut(): Observable<this> {
        return UserModel
            .signOut()
            .pipe(
                map(() => {
                    return this.instantiate({ scene: SignOut.onSuccessThenServicePresentsSignInView });
                })
                , catchError(error => this.just({ scene: SignOut.onFailureThenServicePresentsError, error }))
            );
    }
}