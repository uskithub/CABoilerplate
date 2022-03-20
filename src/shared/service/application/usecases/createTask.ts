import { Nodable } from "../../domain/models/task";

/**
 * usecase: タスクを作成する
 */
export const enum CreateTask {
    /* 基本コース */
    userInputsWhatATaskIs = "ユーザはタスクの内容を入力する"
    , serviceValidateInputs = "サービスは入力項目に問題がないかを確認する"
    , onSuccessInValidatingThenServiceAddTheTask = "入力項目に問題がない場合_サービスはタスクを追加する"
    , onSuccessInAddingThenServiceAddTheTask = "タスクの追加に成功した場合_サービスはホーム画面を表示する"

    /* 代替コース */
    , onFailureInValidatingThenServicePresentsError = "入力項目に問題がある場合_サービスはエラーを表示する"
    , onFailureInAddingThenServicePresentsError = "タスクの追加に失敗した場合_サービスはエラーを表示する"
}

export type CreateTaskContext = { scene: CreateTask.userInputsWhatATaskIs; input: string|Nodable; doingTask: Task|null }
    | { scene: CreateTask.serviceValidateInputs; }
    | { scene: CreateTask.onSuccessInAddingThenServiceAddTheTask; user: User; }
    | { scene: Boot.sessionNotExistsThenServicePresentsSignin }
;