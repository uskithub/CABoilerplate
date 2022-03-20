import { Usecase } from "robustive-ts";
import { Observable } from "rxjs";

/**
 * usecase: プロジェクトを作成する
 */
export const enum CreateProject {
    /* 基本コース */
    userInputsWhatAProjectIs = "ユーザはプロジェクトの内容を入力する"
    , serviceAuthorizeCreatingProject = "サービスはユーザのプロジェクト作成を承認する"
    , onSuccessInAuthorizingThenserviceValidateTheProject = "承認に成功した場合_サービスは入力項目に問題がないかを確認する"
    , onSuccessInValidatingThenServiceCreateAProject = "入力項目に問題がない場合_サービスはプロジェクトを作成する"
    , onSuccessInCreatingThenServiceNotifiesSuccess = "アカウントの発行に成功した場合_サービスは成功を通知する"

    /* 代替コース */
    , onFailureInAuthorizingThenServiceNotifiesError = "承認ができなかった場合_サービスはエラーを通知する"
    , onFailureInValidatingThenServiceNotifiesError = "入力項目に問題がある場合_サービスはエラーを通知する"
    , onFailureInPCreatingThenServiceNotifiesError = "アカウントの発行に失敗した場合_サービスはエラーを通知する"
}

export type CreateProjectContext = { scene: CreateProject.userInputsWhatAProjectIs; }
    | { scene: CreateProject.serviceAuthorizeCreatingProject; }
    | { scene: CreateProject.onSuccessInAuthorizingThenserviceValidateTheProject; }
    | { scene: CreateProject.onSuccessInValidatingThenServiceCreateAProject; }
    | { scene: CreateProject.onSuccessInCreatingThenServiceNotifiesSuccess; }
    | { scene: CreateProject.onFailureInAuthorizingThenServiceNotifiesError; }
    | { scene: CreateProject.onFailureInValidatingThenServiceNotifiesError; }
    | { scene: CreateProject.onFailureInPCreatingThenServiceNotifiesError; }
    ;


export class CreateProjectUsecase extends Usecase<CreateProjectContext> {
    context: CreateProjectContext;

    constructor(context: CreateProjectContext) {
        super();
        this.context = context;
    }

    next(): Observable<this>|null {
        switch (this.context.scene) {
        case CreateProject.userInputsWhatAProjectIs: {
            return this.just({ scene: CreateProject.serviceAuthorizeCreatingProject });
        }
        case CreateProject.serviceAuthorizeCreatingProject: {
            return null;
        }
        case CreateProject.onSuccessInAuthorizingThenserviceValidateTheProject: {
            return this.validate();
        }
        case CreateProject.onSuccessInValidatingThenServiceCreateAProject: {
            return null;
        }
        case CreateProject.onSuccessInCreatingThenServiceNotifiesSuccess: {
            return null;
        }
        case CreateProject.onFailureInAuthorizingThenServiceNotifiesError: {
            return null;
        }
        case CreateProject.onFailureInValidatingThenServiceNotifiesError: {
            return null;
        }
        case CreateProject.onFailureInPCreatingThenServiceNotifiesError: {
            return null;
        }
        }
    }

    private validate(): Observable<this> {
        const result = ProjectModel.validate();
    }
}