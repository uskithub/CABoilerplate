
import type { SignInValidationResult, User } from "@models/user";
import UserModel from "@models/user";
import { Usecase } from "robustive-ts";
import { catchError, map, Observable } from "rxjs";

/**
 * usecase: サインインする
 */
export const enum SignIn {
    /* 基本コース */
    userStartsSignInProcess = "ユーザはサインインを開始する"
    , serviceValidateInputs = "サービスは入力項目に問題がないかを確認する"
    , onSuccessInValidatingThenServiceTrySigningIn = "入力項目に問題がない場合_サービスはサインインを試行する"
    , onSuccessThenServicePresentsHomeView = "成功した場合_サービスはホーム画面を表示する"

    /* 代替コース */
    , onFailureInValidatingThenServicePresentsError = "入力項目に問題がある場合_サービスはエラーを表示する"
    , onFailureThenServicePresentsError = "失敗した場合_サービスはエラーを表示する"
}

export type SignInContext = { scene: SignIn.userStartsSignInProcess; id: string|null; password: string|null; }
    | { scene: SignIn.serviceValidateInputs; id: string|null; password: string|null; }
    | { scene: SignIn.onSuccessInValidatingThenServiceTrySigningIn; id: string; password: string; }
    | { scene: SignIn.onSuccessThenServicePresentsHomeView; user: User; }
    | { scene: SignIn.onFailureInValidatingThenServicePresentsError; result: SignInValidationResult; }
    | { scene: SignIn.onFailureThenServicePresentsError; error: Error; }
;

export class SignInUsecase extends Usecase<SignInContext> {
    context: SignInContext;

    constructor(context: SignInContext) {
        super();
        this.context = context;
    }

    next(): Observable<this>|null {
        switch (this.context.scene) {
        case SignIn.userStartsSignInProcess: {
            return this.just({ scene: SignIn.serviceValidateInputs, id: this.context.id, password: this.context.password });
        }
        case SignIn.serviceValidateInputs: {
            return this.validate(this.context.id, this.context.password);
        }
        case SignIn.onSuccessInValidatingThenServiceTrySigningIn : {
            return this.signIn(this.context.id, this.context.password);
        }
        case SignIn.onSuccessThenServicePresentsHomeView: {
            return null;
        }
        case SignIn.onFailureInValidatingThenServicePresentsError: {
            return null;
        }
        case SignIn.onFailureThenServicePresentsError: {
            return null;
        }
        }
    }

    private validate(id: string|null, password: string|null): Observable<this> {
        const result = UserModel.validate(id, password);
        if (result === true && id !== null && password != null) {
            return this.just({ scene: SignIn.onSuccessInValidatingThenServiceTrySigningIn, id, password });
        } else {
            return this.just({ scene: SignIn.onFailureInValidatingThenServicePresentsError, result });
        }
    }

    private signIn(id: string, password: string): Observable<this> {
        return UserModel
            .signIn(id, password)
            .pipe(
                map(user => {
                    return this.instantiate({ scene: SignIn.onSuccessThenServicePresentsHomeView, user });
                })
                , catchError(error => this.just({ scene: SignIn.onFailureThenServicePresentsError, error }))
            );
    }
}