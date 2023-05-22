import type { SignUpValidationResult } from "@/shared/service/domain/authentication/user";
import { User } from "@/shared/service/domain/authentication/user";
import UserModel from "@/shared/service/domain/authentication/user";
import ServiceModel from "@domain/services/service";
import { Actor, boundary, Boundary, ContextualizedScenes, Usecase } from "robustive-ts";
import { first, map, Observable } from "rxjs";

/**
 * usecase: サインアップする
 */
const scenes = {
    /* Basic Courses */
    userStartsSignUpProcess : "ユーザはサインアップを開始する"
    , serviceValidateInputs : "サービスは入力項目に問題がないかを確認する"
    , onSuccessInValidatingThenServicePublishNewAccount : "入力項目に問題がない場合_サービスはアカウントを新規に発行する"

    /* Boundaries */
    , goals : {
        onSuccessInPublishingThenServicePresentsHomeView : "アカウントの発行に成功した場合_サービスはホーム画面を表示する"
        , onFailureInValidatingThenServicePresentsError : "入力項目に問題がある場合_サービスはエラーを表示する"
        , onFailureInPublishingThenServicePresentsError : "アカウントの発行に失敗した場合_サービスはエラーを表示する"
    }
} as const;

type SignUp = typeof scenes[keyof typeof scenes];

type Goals = ContextualizedScenes<{
    [scenes.goals.onSuccessInPublishingThenServicePresentsHomeView] : { user: User; };
    [scenes.goals.onFailureInValidatingThenServicePresentsError] : { result: SignUpValidationResult; };
    [scenes.goals.onFailureInPublishingThenServicePresentsError] : { error: Error; };
}>;

type Scenes = ContextualizedScenes<{
    [scenes.userStartsSignUpProcess] : { id: string|null; password: string|null; };
    [scenes.serviceValidateInputs]: { id: string|null; password: string|null; };
    [scenes.onSuccessInValidatingThenServicePublishNewAccount]: { id: string; password: string; };
}> | Goals;

export const isSignUpGoal = (context: any): context is Goals => context.scene !== undefined && Object.values(scenes.goals).find(c => { return c === context.scene; }) !== undefined;
export const isSignUpScene = (context: any): context is Scenes => context.scene !== undefined && Object.values(scenes).find(c => { return c === context.scene; }) !== undefined;

export const SignUp = scenes;
export type SignUpGolas = Goals;
export type SignUpScenes = Scenes;

export class SignUpUsecase extends Usecase<Scenes> {

    override authorize<T extends Actor<T>>(actor: T): boolean {
        return ServiceModel.authorize(actor, this);
    }

    next(): Observable<this>|Boundary {
        switch (this.context.scene) {
        case scenes.userStartsSignUpProcess: {
            return this.just({ scene: scenes.serviceValidateInputs, id: this.context.id, password: this.context.password });
        }
        case scenes.serviceValidateInputs : {
            return this.validate(this.context.id, this.context.password);
        }
        case scenes.onSuccessInValidatingThenServicePublishNewAccount: {
            return this.publishNewAccount(this.context.id, this.context.password);
        }
        case scenes.goals.onSuccessInPublishingThenServicePresentsHomeView:
        case scenes.goals.onFailureInValidatingThenServicePresentsError:
        case scenes.goals.onFailureInPublishingThenServicePresentsError: {
            return boundary;
        }
        }
    }

    private validate(id: string|null, password: string|null): Observable<this> {
        const result = User.validate(id, password);
        if (result === true && id !== null && password != null) {
            return this.just({ scene: scenes.onSuccessInValidatingThenServicePublishNewAccount, id, password });
        } else {
            return this.just({ scene: scenes.goals.onFailureInValidatingThenServicePresentsError, result });
        }
    }

    private publishNewAccount(id: string, password: string): Observable<this> {
        return User
            .create(id, password)
            .pipe(
                map(user => {
                    return this.instantiate({ scene: scenes.goals.onSuccessInPublishingThenServicePresentsHomeView, user });
                })
                , first() // 一度観測したらsubscriptionを終わらせる
            );
    }
}