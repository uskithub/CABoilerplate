import type { SignUpValidationResult } from "@models/user";
import type { User } from "@models/user";
import UserModel from "@models/user";
import { Anyone, Usecase } from "robustive-ts";
import { first, map, Observable } from "rxjs";

/**
 * usecase: サインアップする
 */
export const enum SignUp {
    /* 基本コース */
    userStartsSignUpProcess = "ユーザはサインアップを開始する"
    , serviceValidateInputs = "サービスは入力項目に問題がないかを確認する"
    , onSuccessInValidatingThenServicePublishNewAccount = "入力項目に問題がない場合_サービスはアカウントは新規に発行する"
    , onSuccessInPublishingThenServicePresentsHomeView = "アカウントの発行に成功した場合_サービスはホーム画面を表示する"

    /* 代替コース */
    , onFailureInValidatingThenServicePresentsError = "入力項目に問題がある場合_サービスはエラーを表示する"
    , onFailureInPublishingThenServicePresentsError = "アカウントの発行に失敗した場合_サービスはエラーを表示する"
}

export type SignUpContext = { scene: SignUp.userStartsSignUpProcess; id: string|null; password: string|null; }
    | { scene: SignUp.serviceValidateInputs; id: string|null; password: string|null; }
    | { scene: SignUp.onSuccessInValidatingThenServicePublishNewAccount; id: string; password: string; }
    | { scene: SignUp.onSuccessInPublishingThenServicePresentsHomeView; user: User; }
    | { scene: SignUp.onFailureInValidatingThenServicePresentsError; result: SignUpValidationResult; }
    | { scene: SignUp.onFailureInPublishingThenServicePresentsError; error: Error; }
    ;

export class SignUpUsecase extends Usecase<SignUpContext, Anyone> {
    context: SignUpContext;

    constructor(context: SignUpContext) {
        super();
        this.context = context;
    }

    next(actor: Anyone): Observable<this>|null {
        switch (this.context.scene) {
        case SignUp.userStartsSignUpProcess: {
            return this.just({ scene: SignUp.serviceValidateInputs, id: this.context.id, password: this.context.password });
        }
        case SignUp.serviceValidateInputs : {
            return this.validate(this.context.id, this.context.password);
        }
        case SignUp.onSuccessInValidatingThenServicePublishNewAccount: {
            return this.publishNewAccount(this.context.id, this.context.password);
        }
        case SignUp.onSuccessInPublishingThenServicePresentsHomeView: {
            // TODO
            return null;
        }
        case SignUp.onFailureInValidatingThenServicePresentsError: {
            return null;
        }
        case SignUp.onFailureInPublishingThenServicePresentsError: {
            return null;
        }
        }
    }

    private validate(id: string|null, password: string|null): Observable<this> {
        const result = UserModel.validate(id, password);
        if (result === true && id !== null && password != null) {
            return this.just({ scene: SignUp.onSuccessInValidatingThenServicePublishNewAccount, id, password });
        } else {
            return this.just({ scene: SignUp.onFailureInValidatingThenServicePresentsError, result });
        }
    }

    private publishNewAccount(id: string, password: string): Observable<this> {
        return UserModel
            .create(id, password)
            .pipe(
                map(user => {
                    return this.instantiate({ scene: SignUp.onSuccessInPublishingThenServicePresentsHomeView, user });
                })
                , first() // 一度観測したらsubscriptionを終わらせる
            );
    }
}