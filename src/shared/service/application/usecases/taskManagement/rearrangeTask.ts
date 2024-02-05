import { Context, Empty } from "robustive-ts";
import { MyBaseScenario } from "../../common";
import { Task, TaskProperties } from "@/shared/service/domain/taskManagement/task";

/**
 * usecase: タスクを再配置する。
 */
export type RearrangeTaskScenes = {
    basics: {
        userRearrangeTask: { task: TaskProperties; currentParent: TaskProperties; newParent: TaskProperties; index: number; };
        userCommitEditing: { task: TaskProperties; currentParent: TaskProperties; newParent: TaskProperties; index: number; };
        systemUpdatesTaskName: { task: TaskProperties; newTitlenewName: string; };
    };
    alternatives: Empty;
    goals: {
        onSuccessInUpdating: Empty;
        taskDoesNotExist: { task: TaskProperties; };
    };
};

export class RearrangeTaskScenario extends MyBaseScenario<RearrangeTaskScenes> {

    next(to: Context<RearrangeTaskScenes>): Promise<Context<RearrangeTaskScenes>> {
        switch (to.scene) {
        case this.keys.basics.userRearrangeTask:
            return this.just(this.basics.userCommitEditing({ task: to.task, currentParent: to.currentParent, newParent: to.newParent, index: to.index }));
        case this.keys.basics.userCommitEditing:
            return this.rearrangeTask(to.task, to.currentParent, to.newParent, to.index);
        default:
            throw new Error(`Not implemented: ${to.scene}`);
        }
    }

    private rearrangeTask(task: TaskProperties, currentParent: TaskProperties, newParent: TaskProperties, index: number): Promise<Context<RearrangeTaskScenes>> {        
        return new Task(task).rearrange(currentParent, newParent, index)
            .then(() => {
                return this.goals.onSuccessInUpdating();
            });
        

    }
}
