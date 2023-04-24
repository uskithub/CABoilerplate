
import type { SignInValidationResult, User } from "@models/user";
import ServiceModel from "@models/service";
import UserModel from "@models/user";
import { Actor, boundary, Boundary, Usecase, Scenes as _S } from "robustive-ts";
import { catchError, map, Observable } from "rxjs";

/**
 * usecase: サインインする
 */
export const scenes = {
    /* Basic Courses */
    userStartsSignInProcess : "ユーザはサインインを開始する"
    , serviceValidateInputs : "サービスは入力項目に問題がないかを確認する"
    , onSuccessInValidatingThenServiceTrySigningIn : "入力項目に問題がない場合_サービスはサインインを試行する"

    /* Boundaries */
    , goals : {
        onSuccessInSigningInThenServicePresentsHomeView : "サインインに成功した場合_サービスはホーム画面を表示する"
        , onFailureInValidatingThenServicePresentsError : "入力項目に問題がある場合_サービスはエラーを表示する"
        , onFailureInSigningInThenServicePresentsError : "サインインに失敗した場合_サービスはエラーを表示する"
    }
} as const;

type SignIn = typeof scenes[keyof typeof scenes];

type Goals = _S<{
    [scenes.goals.onSuccessInSigningInThenServicePresentsHomeView] : { user: User; };
    [scenes.goals.onFailureInValidatingThenServicePresentsError] : { result: SignInValidationResult; };
    [scenes.goals.onFailureInSigningInThenServicePresentsError] : { error: Error; };
}>;

type Scenes = _S<{
    [scenes.userStartsSignInProcess] : { id: string|null; password: string|null; };
    [scenes.serviceValidateInputs] : { id: string|null; password: string|null; };
    [scenes.onSuccessInValidatingThenServiceTrySigningIn] : { id: string; password: string; };
}> | Goals;

export const isSignInGoal = (context: any): context is Goals => context.scene !== undefined && Object.values(scenes.goals).find(c => { return c === context.scene; }) !== undefined;
export const isSignInScene = (context: any): context is Scenes => context.scene !== undefined && Object.values(scenes).find(c => { return c === context.scene; }) !== undefined;

export const SignIn = scenes;
export type SignInGoals = Goals;
export type SignInScenes = Scenes;

export class SignInUsecase extends Usecase<Scenes> {

    override authorize<T extends Actor<T>>(actor: T): boolean {
        return ServiceModel.authorize(actor, this);
    }

    next(): Observable<this>|Boundary {
        switch (this.context.scene) {
        case scenes.userStartsSignInProcess: {
            return this.just({ scene: scenes.serviceValidateInputs, id: this.context.id, password: this.context.password });
        }
        case scenes.serviceValidateInputs: {
            return this.validate(this.context.id, this.context.password);
        }
        case scenes.onSuccessInValidatingThenServiceTrySigningIn : {
            return this.signIn(this.context.id, this.context.password);
        }
        case scenes.goals.onSuccessInSigningInThenServicePresentsHomeView:
        case scenes.goals.onFailureInValidatingThenServicePresentsError:
        case scenes.goals.onFailureInSigningInThenServicePresentsError: {
            return boundary;
        }
        }
    }

    private validate(id: string|null, password: string|null): Observable<this> {
        const result = UserModel.validate(id, password);
        if (result === true && id !== null && password != null) {
            return this.just({ scene: scenes.onSuccessInValidatingThenServiceTrySigningIn, id, password });
        } else {
            return this.just({ scene: scenes.goals.onFailureInValidatingThenServicePresentsError, result });
        }
    }

    private signIn(id: string, password: string): Observable<this> {
        return UserModel
            .signIn(id, password)
            .pipe(
                map(user => this.instantiate({ scene: scenes.goals.onSuccessInSigningInThenServicePresentsHomeView, user }))
                , catchError(error => this.just({ scene: scenes.goals.onFailureInSigningInThenServicePresentsError, error }))
            );
    }
}