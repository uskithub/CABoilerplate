import type { TaskProperties } from "@/shared/service/domain/taskManagement/task";
import { TaskStatus, TaskType } from "@/shared/service/domain/taskManagement/task";
import { Syncronizable, SyncState } from "@/client/system/common";
import { findNodeById, BaseUpdatableTreenode } from "vue3-tree";

export class TaskTreenode extends BaseUpdatableTreenode<TaskProperties> {
    private _task: TaskProperties;

    get id(): string { return this._task.id || ""; }

    get name(): string { return this._task.title; }
    set name(newName: string) { this._task.title = newName; }

    get styleClass(): object | null { return { [this._task.type]: true }; }

    get content(): TaskProperties { return this._task; }
    get subtrees(): this[] {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call
        return this._task.children.map(c => new (this.constructor as any)(c));
    }
    get isDraggable(): boolean { return true; }

    constructor(task: TaskProperties) {
        super();
        this._task = task;
        this.isFolding = false;
    }

    update(newTask: TaskProperties) {
        this._task = newTask;
    }

    findTaskById(id: string, node: TaskProperties = this._task): TaskProperties | null {
        if (node.id === id) { return node; }

        for (const child of node.children) {
            const found = this.findTaskById(id, child);
            if (found) { return found; }
        }
        return null;
    }
}