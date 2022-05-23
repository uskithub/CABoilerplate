import UserModel from "@models/user";
import ServiceModel from "@models/service";
import { catchError, map, Observable } from "rxjs";
import { Actor, boundary, Boundary, Empty, Usecase, UsecaseScenario } from "robustive-ts";

/**
 * usecase: サインアウトする
 */
export const SignOut = {
    /* Basic Courses */
    userStartsSignOutProcess : "ユーザはサインアウトを開始する"
    , serviceClosesSession : "サービスはセッションを終了する"

    /* Alternate Courses */
    , userResignSignOut : "ユーザはサインアウトをキャンセルする"

    /* Boundaries */
    , goals : {
        /* Basic Courses */
        onSuccessThenServicePresentsSignInView : "成功した場合_サービスはサインイン画面を表示する"
        /* Alternate Courses */
        , onFailureThenServicePresentsError : "失敗した場合_サービスはエラーを表示する"
        , servicePresentsHomeView: "サービスはホーム画面を表示する"
    }
} as const;

type SignOut = typeof SignOut[keyof typeof SignOut];

export type SignOutGoal = UsecaseScenario<{
    [SignOut.goals.onSuccessThenServicePresentsSignInView] : Empty
    [SignOut.goals.onFailureThenServicePresentsError] : { error: Error; }
    [SignOut.goals.servicePresentsHomeView] : Empty
}>;

export type SignOutScenario = UsecaseScenario<{
    [SignOut.userStartsSignOutProcess] : Empty
    [SignOut.serviceClosesSession] : Empty
    [SignOut.userResignSignOut] : Empty
}> | SignOutGoal;

export const isSignOutGoal = (context: any): context is SignOutGoal => context.scene !== undefined && Object.values(SignOut.goals).find(c => { return c === context.scene; }) !== undefined;
export const isSignOutScene = (context: any): context is SignOutScenario => context.scene !== undefined && Object.values(SignOut).find(c => { return c === context.scene; }) !== undefined;

export class SignOutUsecase extends Usecase<SignOutScenario> {

    override authorize<T extends Actor<T>>(actor: T): boolean {
        return ServiceModel.authorize(actor, this);
    }

    next(): Observable<this>|Boundary {
        switch (this.context.scene) {
        case SignOut.userStartsSignOutProcess: {
            return this.just({ scene: SignOut.serviceClosesSession });
        }
        case SignOut.serviceClosesSession : {
            return this.signOut();
        }
        case SignOut.userResignSignOut: {
            return this.just({ scene: SignOut.goals.servicePresentsHomeView });
        }
        case SignOut.goals.onSuccessThenServicePresentsSignInView:
        case SignOut.goals.onFailureThenServicePresentsError:
        case SignOut.goals.servicePresentsHomeView: {
            return boundary;
        }
        }
    }

    private signOut(): Observable<this> {
        return UserModel
            .signOut()
            .pipe(
                map(() => {
                    return this.instantiate({ scene: SignOut.goals.onSuccessThenServicePresentsSignInView });
                })
                , catchError(error => this.just({ scene: SignOut.goals.onFailureThenServicePresentsError, error }))
            );
    }
}