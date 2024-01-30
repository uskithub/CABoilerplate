import { Context, Empty } from "robustive-ts";
import { MyBaseScenario } from "../../common";

/**
 * usecase: タスク名を更新する。
 */
export type UpdateTaskNameScenes = {
    basics: {
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

    next(to: Context<UpdateTaskNameScenes>): Promise<Context<UpdateTaskNameScenes>> {
        switch (to.scene) {
        case this.keys.basics.userEntersNewTaskName:
            return this.just(this.basics.userCommitEditing({ taskId: to.taskId, newName: to.newName }));
        case this.keys.basics.userCommitEditing:
            return this.updateTaskName();
        default:
            throw new Error(`Not implemented: ${to.scene}`);
        }
    }

    private updateTaskName(): Promise<Context<UpdateTaskNameScenes>> {
        // TODO: システムはタスク名を更新する
        return this.goals.onSuccessInUpdating();
    }
}
