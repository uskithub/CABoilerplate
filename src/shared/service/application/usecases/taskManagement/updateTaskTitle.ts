import { Context, Empty } from "robustive-ts";
import { MyBaseScenario } from "../../common";
import { Task, TaskProperties } from "@/shared/service/domain/taskManagement/task";

/**
 * usecase: タスク名を更新する。
 */
export type UpdateTaskTitleScenes = {
    basics: {
        userEntersNewTaskName: { task: TaskProperties; newTitle: string; };
        userCommitEditing: { task: TaskProperties; newTitle: string; };
        systemUpdatesTaskName: { task: TaskProperties; newTitlenewName: string; };
    };
    alternatives: Empty;
    goals: {
        onSuccessInUpdating: Empty;
        taskDoesNotExist: { task: TaskProperties; };
    };
};

export class UpdateTaskTitleScenario extends MyBaseScenario<UpdateTaskTitleScenes> {

    next(to: Context<UpdateTaskTitleScenes>): Promise<Context<UpdateTaskTitleScenes>> {
        switch (to.scene) {
        case this.keys.basics.userEntersNewTaskName:
            return this.just(this.basics.userCommitEditing({ task: to.task, newTitle: to.newTitle }));
        case this.keys.basics.userCommitEditing:
            return this.updateTaskTitle(to.task, to.newTitle);
        default:
            throw new Error(`Not implemented: ${to.scene}`);
        }
    }

    private updateTaskTitle(task: TaskProperties, newTitle: string): Promise<Context<UpdateTaskTitleScenes>> {        
        return new Task(task).update(newTitle)
            .then(() => {
                return this.goals.onSuccessInUpdating();
            });
        

    }
}
