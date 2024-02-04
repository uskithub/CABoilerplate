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

const TASK_ID_LENGTH = 20;

// custom directive for autofocus
const vFocus = {
    mounted: (el: HTMLElement) => el.focus()
};

/**
 * task配列（ancestorIdsでソートされている）をツリー構造に変換する
 * @param tasks 
 */
const organize = (tasks: TaskProperties[]): TaskTreenode[] => {
    const _taskIdMap = tasks.reduce((map, t) => {
        map[t.id] = t;
        return map;
    }, {} as Record<string, TaskProperties>);

    return tasks
        .reduce((result, t) => {
            if (t.ancestorIds) {
                const parentId = t.ancestorIds.slice(-TASK_ID_LENGTH);
                if (_taskIdMap[parentId] !== undefined) {
                    const idx = _taskIdMap[parentId].childrenIds.findIndex(id => id === t.id);
                    _taskIdMap[parentId].children[idx] = t;
                } else {
                    result.push(t);
                }
            } else {
                result.push(t);
            }
            return result;
        }, new Array<TaskProperties>())
        .map(t => new TaskTreenode(t));
};

const treenodes = organize(stores.taskManagement.usersTasks);

const state = reactive<{
    treenodes: TaskTreenode[];
    version: number;
}>({
    treenodes
    , version: 0
}) as {
    treenodes: TaskTreenode[];
    version: number;
};

watch(stores.taskManagement.usersTasks, (newVal, oldVal) => {
    console.log("usersTasks changed", newVal, oldVal);
    state.treenodes = organize(newVal);
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