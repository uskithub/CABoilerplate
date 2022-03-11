import { AbstractScene } from "@shared/system/interfaces/usecase";
import { Observable } from "rxjs";
import User from "@models/user";
import type { SignUpValidationResult } from "@models/user";

/**
 * usecase: サインアップする
 */
export const enum SignUp {
    /* 基本コース */
    userStartsSignUpProcess = "ユーザはサインアップを開始する"
    , serviceValidateInputs = "サービスは入力項目に問題がないかを確認する"
    , onSuccessThenservicePublishNewAccount = "入力項目に問題がない場合_サービスはアカウントは新規に発行する"
    , onSuccessThenServicePresentsHomeView = "アカウントの発行に成功した場合_サービスはホーム画面を表示する"

    /* 代替コース */
    , onFailureInInputsThenServicePresentsError = "入力項目に問題がある場合_サービスはエラーを表示する"
    , onFailureInPublishingThenServicePresentsError = "アカウントの発行に失敗した場合_サービスはエラーを表示する"
}

export type SignUpContext = { scene: SignUp.userStartsSignUpProcess; id: string|null; password: string|null; }
    | { scene: SignUp.serviceValidateInputs; id: string|null; password: string|null; }
    | { scene: SignUp.onSuccessThenservicePublishNewAccount }
    | { scene: SignUp.onSuccessThenServicePresentsHomeView }
    | { scene: SignUp.onFailureInInputsThenServicePresentsError; result: SignUpValidationResult; }
    | { scene: SignUp.onFailureInPublishingThenServicePresentsError; error: Error; }
;

export class SignUpScene extends AbstractScene<SignUpContext> {
    context: SignUpContext;

    constructor(context: SignUpContext) {
        super();
        this.context = context;
    }

    next(): Observable<this>|null {
        switch (this.context.scene) {
        case SignUp.userStartsSignUpProcess: {
            return this.just({ scene: SignUp.serviceValidateInputs, id: this.context.id, password: this.context.password });
        }
        case SignUp.serviceValidateInputs : {
            return this.validate(this.context.id, this.context.password);
        }
        case SignUp.onSuccessThenservicePublishNewAccount: {
            // TODO
            return null;
        }
        case SignUp.onSuccessThenServicePresentsHomeView: {
            // TODO
            return null;
        }
        case SignUp.onFailureInInputsThenServicePresentsError: {
            return null;
        }
        case SignUp.onFailureInPublishingThenServicePresentsError: {
            return null;
        }
        }
    }

    private validate(id: string|null, password: string|null): Observable<this> {
        const result = User.validate(id, password);
        if (result === true) {
            return this.just({ scene: SignUp.onSuccessThenservicePublishNewAccount });
        } else {
            return this.just({ scene: SignUp.onFailureInInputsThenServicePresentsError, result });
        }
    }
}