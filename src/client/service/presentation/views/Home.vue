<script setup lang="ts">
// service
import type { Task } from "@/shared/service/domain/models/task";
import TaskModel from "@/shared/service/domain/models/task";
import { Boot } from "@/shared/service/application/usecases/boot";
import type { BootScenario } from "@/shared/service/application/usecases/boot";

// view
import { tree, findNodeById } from "vue3-tree";

// system
import { inject, reactive, ref } from "vue";
import type { BehaviorModels } from "../models";
import { BEHAVIOR_MODELS_KEY } from "../models";
import { SignInStatus } from "@/shared/service/domain/interfaces/authenticator";
import type { Treenode } from "vue3-tree";
import "vue3-tree/style.css";

// stubs
import donedleTree from "../../../../../test/stubs/donedle";
import swtTree from "../../../../../test/stubs/swt";
import taskTree from "../../../../../test/stubs/task";

const { shared, user, dispatch } = inject(BEHAVIOR_MODELS_KEY) as BehaviorModels;

// custom directive for autofocus
const vFocus = {
  mounted: (el: HTMLElement) => el.focus()
};

class TaskTreenode implements Treenode<Task> {
  private _task: Task;
  isFolding: boolean;

  constructor(task: Task) {
    this._task = task;
    this.isFolding = false;
  }

  get id(): string { return this._task.id; }

  get name(): string { return this._task.title; }
  set name(newName: string) { this._task.title = newName; }

  get styleClass(): object | null { return { [this._task.type]: true }; }

  get content(): Task { return this._task; }
  get subtrees(): this[] {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this._task.children.map(c => new (this.constructor as any)(c));
  }
  get isDraggable(): boolean { return true; }
}

// const state = reactive<{
//     signInStatus: SignInStatus|null;
// }>({
//     signInStatus: null
// });

if (user.store.signInStatus === null && shared.user === null) {
  dispatch({ scene: Boot.userOpensSite } as BootScenario);
}

const state = reactive<{
  donedleTree: TaskTreenode;
  swtTree: TaskTreenode;
  isEditing: boolean;
}>({
  donedleTree: new TaskTreenode(donedleTree as Task)
  // TODO: TaskTreenodeでの表示。JSON.stringifyを使ったdeepCopyではgetterはコピーされないのでsubtreesが見つからないで落ちる
  // , swtTree: new TaskTreenode(taskTree as Task)
  , swtTree: swtTree as TaskTreenode
  , isEditing: false
});

// console.log("iii", state.swtTree, state.swtTree.subtrees, state.swtTree.subtrees.length);

const onArrange1 = (
  node: TaskTreenode
  , from: {
    id: string
    , node: TaskTreenode
  }
  , to: {
    id: string
    , node: TaskTreenode
  }
  , index: number
) => {
  const _from = findNodeById(from.id, state.donedleTree);
  const _to = findNodeById(to.id, state.donedleTree);
  if (_from === null || _to === null) return;
  // 元親から削除
  _from.content.children = _from.content.children.filter((child) => child.id !== node.id);
  // 新親に追加
  _to.content.children.splice(index, 0, node.content);
  _to.isFolding = false;
};

const onArrange2 = (
  node: TaskTreenode
  , from: {
    id: string
    , node: TaskTreenode
  }
  , to: {
    id: string
    , node: TaskTreenode
  }
  , index: number
) => {
  const _from = findNodeById(from.id, state.swtTree);
  const _to = findNodeById(to.id, state.swtTree);
  if (_from === null || _to === null) return;
  // 元親から削除
  _from.subtrees = _from.subtrees.filter((subtree) => subtree.id !== node.id);
  // 新親に追加
  _to.subtrees.splice(index, 0, node);
  _to.isFolding = false;
};

const onToggleFolding1 = (id: string) => {
  const node = findNodeById(id, state.donedleTree);
  if (node === null) return;
  node.isFolding = !node.isFolding;
};

const onToggleFolding2 = (id: string) => {
  const node = findNodeById(id, state.swtTree);
  if (node === null) return;
  node.isFolding = !node.isFolding;
};

const onClickExport = (event: MouseEvent, node: TaskTreenode) => {
  console.log("export", node);
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(JSON.stringify(node))
      .then(function () {
        alert('done!');
      });
  } else {
    alert('failed!');
  }
};

const onUpdateName1 = (id: string, newName: string) => {
  const node = findNodeById(id, state.donedleTree);
  if (node === null) return;
  node.name = newName;
};

const onUpdateName2 = (id: string, newName: string) => {
  const node = findNodeById(id, state.swtTree);
  if (node === null) return;
  node.name = newName;
};

const onToggleEditing = (id: string, isEditing: boolean) => {
  const node = findNodeById(id, state.swtTree);
  if (node === null) return;
  state.isEditing = isEditing;
};

</script>

<template lang="pug">
v-container
  //- div [{{ user.store.signInStatus }}]
  //- div [{{ shared.user?.mailAddress }}]
  //- template(v-if="user.store.signInStatus === null")
  //-   v-progress-circular(:size="70", :width="7", color="purple", indeterminate)
  //- template(v-else-if="user.store.signInStatus === SignInStatus.signOut")
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
  tree(
    :node="state.donedleTree"
    @arrange="onArrange1"
    @toggle-folding="onToggleFolding1"
    @update-name="onUpdateName1"
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
    @arrange="onArrange2"
    @toggle-folding="onToggleFolding2"
    @update-name="onUpdateName2"
    @toggle-editing="onToggleEditing"
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
                    :items="TaskModel.getAvailableTaskTypes(slotProps.node, slotProps.parent)"
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