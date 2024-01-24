<script setup lang="ts">
// service
import { TaskTreenode } from "../../models/taskTreenode";
import { Task, TaskType } from "@/shared/service/domain/taskManagement/task";
import type { TaskProperties } from "@/shared/service/domain/taskManagement/task";

// view
import { tree, findNodeById } from "vue3-tree";
// system
import { inject, reactive, watch } from "vue";
import type { Service } from "../../../application/performers";
import { SERVICE_KEY } from "../../../application/performers";
import type { TreeEventHandlers } from "vue3-tree";
import "vue3-tree/style.css";

// stubs
import donedleTree from "../../../../../../test/stubs/donedle";
import swtTree from "../../../../../../test/stubs/swt";
import taskTree from "../../../../../../test/stubs/task";


const { stores, dispatch } = inject<Service>(SERVICE_KEY)!;

// custom directive for autofocus
const vFocus = {
    mounted: (el: HTMLElement) => el.focus()
};

// const state = reactive<{
//     signInStatus: SignInStatus|null;
// }>({
//     signInStatus: null
// });

const state = reactive<{
    donedleTree: TaskTreenode;
    swtTree: TaskTreenode;
    isEditing: boolean;
}>({
    donedleTree: new TaskTreenode(donedleTree as TaskProperties)
    // TODO: TaskTreenodeでの表示。JSON.stringifyを使ったdeepCopyではgetterはコピーされないのでsubtreesが見つからないで落ちる
    // , swtTree: new TaskTreenode(taskTree as Task)
    , swtTree: new TaskTreenode(swtTree as TaskProperties)
    , isEditing: false
});

watch(stores.application.userTasks, (newVal: TaskProperties[]) => {
    const tree = new TaskTreenode(null, newVal);
    console.log("tree", tree);
    state.donedleTree = tree;
});

const handlers: TreeEventHandlers<TaskTreenode> = {
    "arrange" : (node: TaskTreenode, from: { id: string; node: TaskTreenode; }, to: { id: string; node: TaskTreenode; }, index: number) => {
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

const handlers2: TreeEventHandlers<TaskTreenode> = {
    "arrange" : (node: TaskTreenode, from: { id: string; node: TaskTreenode; }, to: { id: string; node: TaskTreenode; }, index: number) => {
        const _from = findNodeById(from.id, state.swtTree);
        const _to = findNodeById(to.id, state.swtTree);
        if (_from === null || _to === null) return;
        // 元親から削除
        _from.content.children = _from.content.children.filter((child) => child.id !== node.id);
        // 新親に追加
        _to.subtrees.splice(index, 0, node);
        _to.isFolding = false;
    }
    , "toggle-folding" : (id: string) => {
        const node = findNodeById(id, state.swtTree);
        if (node === null) return;
        node.isFolding = !node.isFolding;
    }
    , "toggle-editing" : (id: string, isEditing: boolean) => {
        const node = findNodeById(id, state.swtTree);
        if (node === null) return;
        state.isEditing = isEditing;
    }
    , "update-node" : (newValue: TaskTreenode) => {
        const node = findNodeById(newValue.id, state.swtTree) as TaskTreenode;
        if (node === null) return;
        node.update(newValue.content);
        // TODO reaciveを起こさないといけない
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
  //- div [{{ user.store.signInStatus }}]
  //- div [{{ shared.user?.mailAddress }}]
  //- template(v-if="user.store.signInStatus.case === SignInStatus.unknown")
  //-   v-progress-circular(:size="70", :width="7", color="purple", indeterminate)
  //- template(v-else-if="user.store.signInStatus.case === SignInStatus.signOut")
  //-   h1 Home {{ shared.user?.mailAddress }}
  //-   ul
  //-     li
  //-       router-link(to="/signin") -> SignIn
  //-     li
  //-       router-link(to="/signup") -> SignUp
  //- template(v-else)
  //-   ul
  //-     li(v-for="task in user.store.userTasks", :key="task.id")
  //-       | {{ task.title }}
  //- br
  //- v-data-table.elevation-1(
  //-   :headers="headers"
  //-   :items="stores.authentication.userTasks"
  //-   :items-per-page="25"
  //-   multi-sort
  //- )
    //- template(v-slot:item.project="{ item }") {{ detectProjectName(item.ancestorIds, item.id) }}
    //- template(v-slot:item.type="{ item }")
    //-   v-chip(:color="colorOfTaskType(item.type)") {{ item.type }}
    //- template(v-slot:item.title="{ item }")
    //-   v-list-item(two-line)
    //-     v-list-item-content
    //-       v-list-item-subtitle {{ item.ancestors.map(t => t.title).reverse().join(" > ") }}
    //-       v-list-item-title {{ item.title }}
  tree(
    :node="state.donedleTree"
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
      span.title(v-else) {{ slotProps.node.name }}
  br
  tree(
    :node="state.swtTree"
    @arrange="handlers2['arrange']"
    @toggle-folding="handlers2['toggle-folding']"
    @toggle-editing="handlers2['toggle-editing']"
    @update-node="handlers2['update-node']"
  )
    template(v-slot="slotProps")
      v-dialog(v-model="slotProps.isEditing" persistent)
        v-card
          v-card-text
            v-container
              v-row
                v-col(cols="12" sm="8")
                  v-text-field(v-model="slotProps.node.name" label="Task Name" required autofocus)
                v-col(cols="12" sm="4")
                  v-select(
                    v-model="slotProps.node.type"
                    :items="Task.getAvailableTaskTypes(slotProps.node, slotProps.parent)"
                    label="TaskType"
                    required
                  )
            small *indicates required field
          v-card-actions
            v-container
              v-row
                v-col(cols="12" sm="6")
                  v-btn(
                    color="blue-darken-1"
                    variant="text"
                    block
                    @click="() => slotProps.endEditing(false)"
                  ) Cancel
                v-col(cols="12" sm="6")
                  v-btn(
                    color="blue-darken-1"
                    variant="text"
                    block
                    @click="() => slotProps.endEditing(true, slotProps.node)"
                  ) Save
      template(v-if="slotProps.depth === 0")
        span.header {{ slotProps.node.name }}
        v-icon(
          v-show="slotProps.isHovering" 
          icon="mdi:mdi-export-variant"
          @click.prevent="onClickExport($event, slotProps.node)"
        )
      span.title(v-else) {{ slotProps.node.name }}
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