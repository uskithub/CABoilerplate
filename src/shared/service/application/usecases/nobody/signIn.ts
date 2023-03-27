
import type { SignInValidationResult, User } from "@models/user";
import ServiceModel from "@models/service";
import UserModel from "@models/user";
import { Actor, boundary, Boundary, Usecase, UsecaseScenario } from "robustive-ts";
import { catchError, map, Observable } from "rxjs";

/**
 * usecase: サインインする
 */
export const SignIn = {
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

type SignIn = typeof SignIn[keyof typeof SignIn];

export type SignInGoal = UsecaseScenario<{
    [SignIn.goals.onSuccessInSigningInThenServicePresentsHomeView] : { user: User; };
    [SignIn.goals.onFailureInValidatingThenServicePresentsError] : { result: SignInValidationResult; };
    [SignIn.goals.onFailureInSigningInThenServicePresentsError] : { error: Error; };
}>;

export type SignInScenario = UsecaseScenario<{
    [SignIn.userStartsSignInProcess] : { id: string|null; password: string|null; };
    [SignIn.serviceValidateInputs] : { id: string|null; password: string|null; };
    [SignIn.onSuccessInValidatingThenServiceTrySigningIn] : { id: string; password: string; };
}> | SignInGoal;

export const isSignInGoal = (context: any): context is SignInGoal => context.scene !== undefined && Object.values(SignIn.goals).find(c => { return c === context.scene; }) !== undefined;
export const isSignInScene = (context: any): context is SignInScenario => context.scene !== undefined && Object.values(SignIn).find(c => { return c === context.scene; }) !== undefined;

export class SignInUsecase extends Usecase<SignInScenario> {

    override authorize<T extends Actor<T>>(actor: T): boolean {
        return ServiceModel.authorize(actor, this);
    }

    next(): Observable<this>|Boundary {
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
        case SignIn.goals.onSuccessInSigningInThenServicePresentsHomeView:
        case SignIn.goals.onFailureInValidatingThenServicePresentsError:
        case SignIn.goals.onFailureInSigningInThenServicePresentsError: {
            return boundary;
        }
        }
    }

    private validate(id: string|null, password: string|null): Observable<this> {
        const result = UserModel.validate(id, password);
        if (result === true && id !== null && password != null) {
            return this.just({ scene: SignIn.onSuccessInValidatingThenServiceTrySigningIn, id, password });
        } else {
            return this.just({ scene: SignIn.goals.onFailureInValidatingThenServicePresentsError, result });
        }
    }

    private signIn(id: string, password: string): Observable<this> {
        return UserModel
            .signIn(id, password)
            .pipe(
                map(user => this.instantiate({ scene: SignIn.goals.onSuccessInSigningInThenServicePresentsHomeView, user }))
                , catchError(error => this.just({ scene: SignIn.goals.onFailureInSigningInThenServicePresentsError, error }))
            );
    }
}