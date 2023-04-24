import UserModel from "@models/user";
import ServiceModel from "@models/service";
import { catchError, map, Observable } from "rxjs";
import { Actor, boundary, Boundary, ContextualizedScenes, Empty, Usecase } from "robustive-ts";

/**
 * usecase: サインアウトする
 */
const scenes = {
    /* Basic Courses */
    userStartsSignOutProcess: "ユーザはサインアウトを開始する"
    , serviceClosesSession: "サービスはセッションを終了する"

    /* Alternate Courses */
    , userResignSignOut: "ユーザはサインアウトをキャンセルする"

    /* Boundaries */
    , goals: {
        /* Basic Courses */
        onSuccessThenServicePresentsSignInView: "成功した場合_サービスはサインイン画面を表示する"
        /* Alternate Courses */
        , onFailureThenServicePresentsError: "失敗した場合_サービスはエラーを表示する"
        , servicePresentsHomeView: "サービスはホーム画面を表示する"
    }
} as const;

type SignOut = typeof scenes[keyof typeof scenes];

type Goals = ContextualizedScenes<{
    [scenes.goals.onSuccessThenServicePresentsSignInView]: Empty
    [scenes.goals.onFailureThenServicePresentsError]: { error: Error; }
    [scenes.goals.servicePresentsHomeView]: Empty
}>;

type Scenes = ContextualizedScenes<{
    [scenes.userStartsSignOutProcess]: Empty
    [scenes.serviceClosesSession]: Empty
    [scenes.userResignSignOut]: Empty
}> | Goals;

export const isSignOutGoal = (context: any): context is Goals => context.scene !== undefined && Object.values(scenes.goals).find(c => { return c === context.scene; }) !== undefined;
export const isSignOutScene = (context: any): context is Scenes => context.scene !== undefined && Object.values(scenes).find(c => { return c === context.scene; }) !== undefined;

export const SignOut = scenes;
export type SignOutGoals = Goals;
export type SignOutScenes = Scenes;

export class SignOutUsecase extends Usecase<Scenes> {

    override authorize<T extends Actor<T>>(actor: T): boolean {
        return ServiceModel.authorize(actor, this);
    }

    next(): Observable<this> | Boundary {
        switch (this.context.scene) {
        case scenes.userStartsSignOutProcess: {
            return this.just({ scene: scenes.serviceClosesSession });
        }
        case scenes.serviceClosesSession: {
            return this.signOut();
        }
        case scenes.userResignSignOut: {
            return this.just({ scene: scenes.goals.servicePresentsHomeView });
        }
        case scenes.goals.onSuccessThenServicePresentsSignInView:
        case scenes.goals.onFailureThenServicePresentsError:
        case scenes.goals.servicePresentsHomeView: {
            return boundary;
        }
        }
    }

    private signOut(): Observable<this> {
        return UserModel
            .signOut()
            .pipe(
                map(() => {
                    return this.instantiate({ scene: scenes.goals.onSuccessThenServicePresentsSignInView });
                })
                , catchError(error => this.just({ scene: scenes.goals.onFailureThenServicePresentsError, error }))
            );
    }
}