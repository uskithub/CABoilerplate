<script setup lang="ts">
// service
import { TaskTreenode } from "../../models/taskTreenode";
import { Task, TaskType } from "@/shared/service/domain/taskManagement/task";
import type { TaskProperties } from "@/shared/service/domain/taskManagement/task";

// view
import { tree } from "vue3-tree";

// system
import type { Service } from "@/client/service/application/performers";
import { SERVICE_KEY } from "@/client/service/application/performers";
import { computed, inject, reactive, watch } from "vue";
import type { TreeEventHandlers } from "vue3-tree";
import "vue3-tree/style.css";
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
const organizeToTreeStructure = (tasks: TaskProperties[]): [ Record<string, TaskProperties>, TaskTreenode[] ] => {
    const _taskIdMap = tasks.reduce((map, t) => {
        map[t.id] = t;
        return map;
    }, {} as Record<string, TaskProperties>);

    return [ _taskIdMap
        , tasks
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
            .map(t => new TaskTreenode(t))
        ];
};

let [ taskIdMap, treenodes ] = organizeToTreeStructure(stores.taskManagement.usersTasks);

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
    const [ _taskIdMap, treenodes ] = organizeToTreeStructure(newVal);
    taskIdMap = _taskIdMap;
    state.treenodes = treenodes
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

type IdAndNode = { id: string; node: TaskTreenode; };

const onRearrange = (root: TaskTreenode, targetId: string, from: string, to: string, index: number) => {
    console.log("rearrange", root, targetId, from, to, index);
    const target = taskIdMap[targetId];
    const currentParent = taskIdMap[from];
    const newParent = taskIdMap[to];
    if (target === undefined || currentParent === undefined || newParent === undefined) {
        console.error("node not found", from, to);
        return;
    }
    dispatch(R.taskManagement.rearrangeTask.basics.userRearrangeTask({ 
        task: target
        , currentParent
        , newParent
        , index
    }));    
}
</script>

<template lang="pug">
v-container
  template(v-for="tasknode in state.treenodes", :key="tasknode.id")
    tree(
      :node="tasknode"
      :version="state.version"
      @update-name="(id: string, newValue: string) => onUpdateName(tasknode, id, newValue)"
      @rearrange="(targetId: string, from: string, to: string, index: number) => onRearrange(tasknode, targetId, from, to, index)"
    )
  
</template>

<style lang="sass" scoped></style>