<script setup lang="ts">
// service
import { TaskTreenode } from "../../models/taskTreenode";
import { Task, TaskType } from "@/shared/service/domain/taskManagement/task";
import type { TaskProperties } from "@/shared/service/domain/taskManagement/task";

// view
import { tree, findNodeById } from "vue3-tree";

// system
import type { Service } from "@/client/service/application/performers";
import { SERVICE_KEY } from "@/client/service/application/performers";
import { Syncable } from "@/client/system/common";
import { inject, reactive } from "vue";
import type { TreeEventHandlers } from "vue3-tree";
import "vue3-tree/style.css";
import { computed } from "vue";
import { watch } from "vue";
import { R } from "@/shared/service/application/usecases";

const { stores, dispatch } = inject<Service>(SERVICE_KEY)!;

// custom directive for autofocus
const vFocus = {
    mounted: (el: HTMLElement) => el.focus()
};

// const organize = (tasks: TaskProperties[]): TaskTreenode[] => {
//     const _recursive = (arr: TaskProperties[]) => {
//         return arr.reduce((result, t) => {
//             result.push(new TaskTreenode(t));
//             const children = t.children.reduce((children, id) => {
//                 const child = tasks.find(i => i.id === id);
//                 if (child !== undefined) children.push(child);
//                 return children;
//             }, new Array<TaskTreenode>());
//             if (children.length > 0) {
//                 task.children = _recursive(children);
//             } else {
//                 task.children = [];
//             }
//             return result;
//         }, new Array<TaskTreenode>());
//     };
//     return _recursive(tasks);
// };
// const recursive = (arr: Task[]) => {
//         return arr.reduce((result, task) => {
//             result.push(task);
//             const children = task._children.reduce((children, id) => {
//                 const child = state.tasks.find(t => t.id === id);
//                 if (child !== undefined) children.push(child);
//                 return children;
//             }, new Array<Task>());
//             if (children.length > 0) {
//                 task.children = recursive(children);
//             } else {
//                 task.children = [];
//             }
//             return result;
//         }, new Array<Task>());
//     };
//     return recursive(state.tasks.filter(t => t.isRoot));
// };

const state = reactive<{
    treenodes: TaskTreenode[];
    version: number;
}>({
    treenodes: stores.taskManagement.usersTasks.map(t => new TaskTreenode(t))
    , version: 0
}) as {
    treenodes: TaskTreenode[];
    version: number;
};

watch(stores.taskManagement.usersTasks, (newVal, oldVal) => {
    console.log("usersTasks changed", newVal, oldVal);
    state.treenodes = newVal.map(t => new TaskTreenode(t));
    state.version += 1;
});

const onUpdateName = (root: TaskTreenode, id: string, newValue: string) => {
    const task = root.findTaskById(id);
    if (task === null) {
        console.error("node not found", id);
        return;
    }
    dispatch(R.taskManagement.updateTaskTitle.basics.userEntersNewTaskName({ task, newTitle: newValue }));
};

</script>

<template lang="pug">
v-container
  template(v-for="tasknode in state.treenodes", :key="tasknode.id")
    tree(
      :node="tasknode"
      :version="state.version"
      @update-name="(id: string, newValue: string) => onUpdateName(tasknode, id, newValue)"
    )
  
</template>

<style lang="sass" scoped></style>