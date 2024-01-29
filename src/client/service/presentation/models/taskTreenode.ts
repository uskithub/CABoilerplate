import type { TaskProperties } from "@/shared/service/domain/taskManagement/task";
import { TaskStatus, TaskType } from "@/shared/service/domain/taskManagement/task";
import { findNodeById, type Treenode } from "vue3-tree";

export class TaskTreenode implements Treenode<TaskProperties> {
    private _task: TaskProperties;
    isFolding: boolean;

    constructor(task: TaskProperties) {
        this._task = task;
        this.isFolding = false;
    }

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

    update(newTask: TaskProperties) {
        this._task = newTask;
    }

    // arrange(node: TaskTreenode, from: { id: string; node: TaskTreenode; }, to: { id: string; node: TaskTreenode; }, index: number) {
    //     const _from = findNodeById(from.id, state.donedleTree);
    //     const _to = findNodeById(to.id, state.donedleTree);
    //     if (_from === null || _to === null) return;
    //     // 元親から削除
    //     _from.content.children = _from.content.children.filter((child) => child.id !== node.id);
    //     // 新親に追加
    //     _to.content.children.splice(index, 0, node.content);
    //     _to.isFolding = false;
    // }
    
    toggleFolding(id: string) {
        const node = findNodeById<TaskTreenode>(id, state.donedleTree);
        if (node === null) return;
        node.isFolding = !node.isFolding;
    }
    
    // toggleEditing(id: string, isEditing: boolean) {
    //     const node = findNodeById(id, state.swtTree);
    //     if (node === null) return;
    //     state.isEditing = isEditing;
    // }
    
    // updateNode(newValue: TaskTreenode) {
    //     const node = findNodeById(newValue.id, state.donedleTree);
    //     if (node === null) return;
    //     node.update(newValue.content);
    // }
}