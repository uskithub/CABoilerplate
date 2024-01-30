import { TaskProperties } from "@/shared/service/domain/taskManagement/task";
import { Empty } from "robustive-ts";
import { MyBaseScenario } from "../../common";


/**
 * usecase: タスク名を更新する。
 */
export type UpdateTaskNameScenes = {
    basics: {
        userSelectsTask: { task: TaskProperties; };
        userEntersNewTaskName: { taskId: string; newName: string; };
        userCommitEditing: { taskId: string; newName: string; };
        systemUpdatesTaskName: { taskId: string; newName: string; };
    };
    alternatives: Empty;
    goals: {
        onSuccessInUpdating: Empty;
        taskDoesNotExist: { taskId: string; };
    };
};

export class UpdateTaskNameScenario extends MyBaseScenario<UpdateTaskNameScenes> {

    next(to: MutableContext<UpdateTaskNameScenes>): Promise<Context<UpdateTaskNameScenes>> {
        switch (to.scene) {
            case this.keys.basics.userOpensTaskList:
                return this.just(this.basics.userSelectsTask());
            case this.keys.basics.userSelectsTask:
                return this.just(this.basics.userEntersNewTaskName());
            case this.keys.basics.userEntersNewTaskName:
                return this.just(this.basics.userClicksUpdateButton());
            case this.keys.basics.userClicksUpdateButton:
                return this.updateTaskName();
            case this.keys.alternatives.taskDoesNotExist:
                return this.handleTaskNotExist();
            case this.keys.alternatives.networkErrorOccurs:
                return this.handleNetworkError();
            default:
                throw new Error(`Not implemented: ${to.scene}`);
        }
    }

    private updateTaskName(): Promise<Context<UpdateTaskNameScenes>> {
        // TODO: システムはタスク名を更新する
        return this.goals.systemShowsSuccessNotification();
    }

    private handleTaskNotExist(): Promise<Context<UpdateTaskNameScenes>> {
        // TODO: タスクが存在しない場合のエラー処理
        throw new Error('Task does not exist');
    }

    private handleNetworkError(): Promise<Context<UpdateTaskNameScenes>> {
        // TODO: ネットワークエラー発生時の処理
        throw new Error('Network error');
    }
}
