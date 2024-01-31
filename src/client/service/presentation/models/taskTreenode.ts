import type { TaskProperties } from "@/shared/service/domain/taskManagement/task";
import { TaskStatus, TaskType } from "@/shared/service/domain/taskManagement/task";
import { Syncronizable, SyncState } from "@/client/system/common";
import { findNodeById, BaseUpdatableTreenode } from "vue3-tree";

export class TaskTreenode extends BaseUpdatableTreenode<TaskProperties> {
    private _task: TaskProperties;
    private _subtrees: this[];

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
        this._subtrees = task.children.map(c => new (this.constructor as any)(c));  
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

    arrange(targetId : string, from: string, to: string, index: number) {
        const node = this.findTaskById(targetId);
        const exParent = this.findTaskById(from);
        const newParent = this.findTaskById(to);
        if (node === null || exParent === null || newParent === null) return;
        // 元親から削除
        exParent.children = exParent.children.filter((child: TaskProperties) => child.id !== targetId);
        // 新親に追加
        newParent.children.splice(index, 0, node);
        // newParent.isFolding = false;
        // サブツリーを再構築
        this._subtrees = this.content.children.map(c => new (this.constructor as any)(c));
    }
}