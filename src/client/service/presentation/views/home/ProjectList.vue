<script setup lang="ts">
// service
import type { Task } from "@/shared/service/domain/projectManagement/task";
import { TaskTreenode } from "../../models/taskTreenode";
import { TaskType } from "@/shared/service/domain/projectManagement/task";
import TaskModel from "@/shared/service/domain/projectManagement/task";

// view
import { tree, findNodeById } from "vue3-tree";
// system
import { inject, reactive, watch } from "vue";
import type { Dispatcher } from "../../../application/performers";
import { DISPATCHER_KEY } from "../../../application/performers";
import type { TreeEventHandlers } from "vue3-tree";
import "vue3-tree/style.css";

// stubs
import donedleTree from "../../../../../../test/stubs/donedle";
import swtTree from "../../../../../../test/stubs/swt";
import taskTree from "../../../../../../test/stubs/task";


const { stores, dispatch } = inject<Dispatcher>(DISPATCHER_KEY)!;

// custom directive for autofocus
const vFocus = {
    mounted: (el: HTMLElement) => el.focus()
};

const state = reactive<{
    tree: TaskTreenode;
    isEditing: boolean;
}>({
    tree: new TaskTreenode(donedleTree as Task)
    , isEditing: false
});

watch(stores.application.userProjects, (newVal: Task[]) => {
    console.log("userProjects", newVal);
    const tree = new TaskTreenode(null, newVal);
    console.log("tree", tree);
    state.tree = tree;
});

const handlers: TreeEventHandlers<TaskTreenode> = {
    "click" : (event: PointerEvent, node: TaskTreenode) => {
        console.log("@@@@@ 呼ばれたよ", node);
    }
    , "arrange" : (node: TaskTreenode, from: { id: string; node: TaskTreenode; }, to: { id: string; node: TaskTreenode; }, index: number) => {
        const _from = findNodeById(from.id, state.donedleTree);
        const _to = findNodeById(to.id, state.donedleTree);
        if (_from === null || _to === null) return;
        // 元親から削除
        _from.content.children = _from.content.children.filter((child) => child.id !== node.id);
        // 新親に追加
        _to.content.children.splice(index, 0, node.content);
        _to.isFolding = false;
    }
    , "toggle-folding" : (id: string) => {
        const node = findNodeById(id, state.donedleTree);
        if (node === null) return;
        node.isFolding = !node.isFolding;
    }
    , "toggle-editing" : (id: string, isEditing: boolean) => {
        const node = findNodeById(id, state.swtTree);
        if (node === null) return;
        state.isEditing = isEditing;
    }
    , "update-node" : (newValue: TaskTreenode) => {
        const node = findNodeById(newValue.id, state.donedleTree);
        if (node === null) return;
        node.update(newValue.content);
    }
};

const onClickExport = (event: MouseEvent, node: TaskTreenode) => {
    console.log("export", node);
    if (navigator.clipboard) {
        navigator.clipboard
            .writeText(JSON.stringify(node))
            .then(function () {
                alert("done!");
            });
    } else {
        alert("failed!");
    }
};

const typeSorter = (a: TaskType, b: TaskType): number => {
    const valuator = (taskType: TaskType): number => {
        switch (taskType) {
        case TaskType.requirement: { return 4; }
        case TaskType.milestone:   { return 3; }
        case TaskType.issue:       { return 2; }
        case TaskType.todo:        { return 1; }
        default:                   { return 9; }
        }
    };
    return valuator(a) - valuator(b);
};

const headers = [
    { title: "プロジェクト", key: "project" }
    , { title: "種類", key: "type", sort: typeSorter }
    , { title: "タスク名", key: "title" }
    , { title: "取り組んでいない期間", key: "periodOfNoDoing" }
];

const colorOfTaskType = (taskType: string): string => {
    switch(taskType) {
    case TaskType.requirement: { return "red"; }
    case TaskType.milestone:   { return "green"; }
    case TaskType.issue:       { return "amber"; }
    case TaskType.todo:        { return "blue-grey"; }
    default:                   { return "gray"; }
    }
};

const ID_LENGTH = "KmE1NPxsOyvUJpTvFEBY".length;

const detectProjectName = (ancestorIds: string|null, id: string): string|null => {
    if (ancestorIds === null || ancestorIds === undefined ) return null;
    const rootTaskId = ancestorIds.substring(0, ID_LENGTH);
    console.log(id, rootTaskId, ID_LENGTH);
    // const idx = stores.currentUser._projects.findIndex(p => p.id === rootTaskId);
    // if (idx > -1) return stores.currentUser._projects[idx].title;
    return null;
};

</script>

<template lang="pug">
v-container
  tree(
    :node="state.tree"
    @click="handlers['click']"
    @arrange="handlers['arrange']"
    @toggle-folding="handlers['toggle-folding']"
    @toggle-editing="handlers['toggle-editing']"
    @update-node="handlers['update-node']"
  )
    template(v-slot="slotProps")
      input(
        v-if="slotProps.isEditing"
        v-model="slotProps.node.name"
        v-focus
        @blur="() => { if (slotProps.endEditing) slotProps.endEditing(slotProps.node.name); }"
      )
      template(v-else-if="slotProps.depth===0")
        span.header {{ slotProps.node.name }}
        v-icon(
          v-show="slotProps.isHovering" 
          icon="mdi:mdi-export-variant"
          @click.prevent="onClickExport($event, slotProps.node)"
        )
      span.title(v-else) {{ slotProps.node.name + " [" + slotProps.node.id + "]" }}
</template>

<style lang="sass" scoped>
.tree
  :deep(li)
    border-left: 5px solid transparent
    .tree-header
      > .header
        font-weight: bold
    .tree-item:hover
      color: #22559c
    &.milestone
      border-left: 5px solid #ede862
      > .tree-item
        > .title:before
          font-family: "Material Design Icons"  
          color: #ede862
          content: "\F023B  "
    &.requirement
      border-left: 5px solid #f27370
      > .tree-item
        > .title:before
          font-family: "Material Design Icons"  
          color: #f27370
          content: "\F0306  "
</style>