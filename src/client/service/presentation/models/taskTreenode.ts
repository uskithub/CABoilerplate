import type { Task } from "@/shared/service/domain/entities/task";
import { TaskStatus, TaskType } from "@/shared/service/domain/entities/task";
import type { Treenode } from "vue3-tree";

export class TaskTreenode implements Treenode<Task> {
    private _task: Task;
    isFolding: boolean;

    constructor(task: Task);
    constructor(task?: Task, children?: Task[]) {
        if (task) {
            this._task = task;
        } else if (children) {
            this._task = {
                id: "root"
                , type: TaskType.privateProject
                , status: TaskStatus.open
                , title: "my tasks"
                , purpose: null
                , goal: null
                , instractions: null
                , author: "set-current-user-id"
                , owner: "set-current-user-id"
                , assignees: []
                , members: ["set-current-user-id"]
                , involved: ["set-current-user-id"]
                , ancestorIds: null
                , _children: children.map(t => t.id)
                , children: children
                , startedAt: null
                , deadline: null
                , logs: []
                , createdAt: new Date()
            };
        } else {
            throw new Error("TaskTreenode constructor must be called with either task or children.");
        }
        this.isFolding = false;
    }

    get id(): string { return this._task.id; }

    get name(): string { return this._task.title; }
    set name(newName: string) { this._task.title = newName; }

    get styleClass(): object | null { return { [this._task.type]: true }; }

    get content(): Task { return this._task; }
    get subtrees(): this[] {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call
        return this._task.children.map(c => new (this.constructor as any)(c));
    }
    get isDraggable(): boolean { return true; }

    update(newTask: Task) {
        this._task = newTask;
    }
}