import { AbstractScene } from "@/shared/system/interfaces/scene";
import { Observable } from "rxjs";

/**
 * usecase: サインインする
 */
export const enum SignIn {
    /* 基本コース */
    userStartsSignInProcess = "ユーザはサインインを開始する"
    , servicePresentsSignInView = "サービスはサインイン画面を表示する"
    , userInputsIdAndPassword = "ユーザはIDとパスワードを入力する"
    , userTriesToSignIn = "ユーザはサインインする"
    , onSuccessThenServicePresentsHomeView = "成功した場合_サービスはホーム画面を表示する"

    /* 代替コース */
    , onFailureThenServicePresentsError = "失敗した場合_サービスはエラーを表示する"
}

export type SignInContext = { scene: SignIn.userStartsSignInProcess }
    | { scene: SignIn.servicePresentsSignInView }
    | { scene: SignIn.userInputsIdAndPassword; userId: string; password: string; }
    | { scene: SignIn.userTriesToSignIn }
    | { scene: SignIn.onSuccessThenServicePresentsHomeView }
    | { scene: SignIn.onFailureThenServicePresentsError; error: Error; }
;

export class SignInScene extends AbstractScene<SignInContext> {
    context: SignInContext;

    constructor(context: SignInContext = { scene: SignIn.userStartsSignInProcess }) {
        super();
        this.context = context;
    }

    next(): Observable<this>|null {
        switch (this.context.scene) {
        case SignIn.userStartsSignInProcess: {
            // TODO
            return null;
        }
        case SignIn.servicePresentsSignInView : {
            // TODO
            return null;
        }
        case SignIn.userInputsIdAndPassword: {
            // TODO
            return null;
        }
        case SignIn.userTriesToSignIn: {
            // TODO
            return null;
        }
        case SignIn.onSuccessThenServicePresentsHomeView: {
            return null;
        }
        case SignIn.onFailureThenServicePresentsError: {
            return null;
        }
        }
    }
}