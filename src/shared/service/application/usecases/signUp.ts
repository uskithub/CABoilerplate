import type { SignUpValidationResult } from "@models/user";
import type { User } from "@models/user";
import UserModel from "@models/user";
import ServiceModel from "@models/service";
import { Actor, boundary, Boundary, Usecase, UsecaseScenario } from "robustive-ts";
import { first, map, Observable } from "rxjs";

/**
 * usecase: サインアップする
 */
export const SignUp = {
    /* Basic Courses */
    userStartsSignUpProcess : "ユーザはサインアップを開始する"
    , serviceValidateInputs : "サービスは入力項目に問題がないかを確認する"
    , onSuccessInValidatingThenServicePublishNewAccount : "入力項目に問題がない場合_サービスはアカウントは新規に発行する"

    /* Boundaries */
    , goals : {
        onSuccessInPublishingThenServicePresentsHomeView : "アカウントの発行に成功した場合_サービスはホーム画面を表示する"
        , onFailureInValidatingThenServicePresentsError : "入力項目に問題がある場合_サービスはエラーを表示する"
        , onFailureInPublishingThenServicePresentsError : "アカウントの発行に失敗した場合_サービスはエラーを表示する"
    }
} as const;

type SignUp = typeof SignUp[keyof typeof SignUp];

export type SignUpGoal = UsecaseScenario<{
    [SignUp.goals.onSuccessInPublishingThenServicePresentsHomeView] : { user: User; };
    [SignUp.goals.onFailureInValidatingThenServicePresentsError] : { result: SignUpValidationResult; };
    [SignUp.goals.onFailureInPublishingThenServicePresentsError] : { error: Error; };
}>;

export type SignUpScenario = UsecaseScenario<{
    [SignUp.userStartsSignUpProcess] : { id: string|null; password: string|null; };
    [SignUp.serviceValidateInputs]: { id: string|null; password: string|null; };
    [SignUp.onSuccessInValidatingThenServicePublishNewAccount]: { id: string; password: string; };
}> | SignUpGoal;

export const isSignUpGoal = (context: any): context is SignUpGoal => context.scene !== undefined && Object.values(SignUp.goals).find(c => { return c === context.scene; }) !== undefined;
export const isSignUpScene = (context: any): context is SignUpScenario => context.scene !== undefined && Object.values(SignUp).find(c => { return c === context.scene; }) !== undefined;


export class SignUpUsecase extends Usecase<SignUpScenario> {

    override authorize<T extends Actor<T>>(actor: T): boolean {
        return ServiceModel.authorize(actor, this);
    }

    next(): Observable<this>|Boundary {
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
        case SignUp.goals.onSuccessInPublishingThenServicePresentsHomeView:
        case SignUp.goals.onFailureInValidatingThenServicePresentsError:
        case SignUp.goals.onFailureInPublishingThenServicePresentsError: {
            return boundary;
        }
        }
    }

    private validate(id: string|null, password: string|null): Observable<this> {
        const result = UserModel.validate(id, password);
        if (result === true && id !== null && password != null) {
            return this.just({ scene: SignUp.onSuccessInValidatingThenServicePublishNewAccount, id, password });
        } else {
            return this.just({ scene: SignUp.goals.onFailureInValidatingThenServicePresentsError, result });
        }
    }

    private publishNewAccount(id: string, password: string): Observable<this> {
        return UserModel
            .create(id, password)
            .pipe(
                map(user => {
                    return this.instantiate({ scene: SignUp.goals.onSuccessInPublishingThenServicePresentsHomeView, user });
                })
                , first() // 一度観測したらsubscriptionを終わらせる
            );
    }
}