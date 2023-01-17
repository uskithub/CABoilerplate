<script setup lang="ts">
// service
import { Boot } from "@/shared/service/application/usecases/boot";
import type { BootScenario } from "@/shared/service/application/usecases/boot";
// view
import treelocal from "./components/organisms/tree.vue";
import { tree, findNodeById } from "vue3-tree";

// system
import { inject, reactive, ref } from "vue";
import type { ViewModels } from "../models";
import { VIEW_MODELS_KEY } from "../models";
import { SignInStatus } from "@/shared/service/domain/interfaces/authenticator";
import type { Treenode } from "vue3-tree";
import "vue3-tree/style.css";

// stubs
import donedleTree from "../../../../../test/stubs/donedle";
import swtTree from "../../../../../test/stubs/swt";

const { shared, user, dispatch } = inject(VIEW_MODELS_KEY) as ViewModels;

// const state = reactive<{
//     signInStatus: SignInStatus|null;
// }>({
//     signInStatus: null
// });

if (user.store.signInStatus === null && shared.user === null) {
  dispatch({ scene: Boot.userOpensSite } as BootScenario);
}

const state = reactive<{
  donedleTree: Treenode;
  swtTree: Treenode;
}>({
  donedleTree: donedleTree as Treenode
  , swtTree: swtTree as Treenode
});

const onArrange1 = (
  node: Treenode
  , from: {
    id: string
    , node: Treenode
  }
  , to: {
    id: string
    , node: Treenode
  }
  , index: number
) => {
  const _from = findNodeById(from.id, state.donedleTree);
  const _to = findNodeById(to.id, state.donedleTree);
  if (_from === null || _to === null) return;
  // 元親から削除
  _from.subtrees = _from.subtrees.filter((subtree) => subtree.id !== node.id);
  // 新親に追加
  _to.subtrees.splice(index, 0, node);
  _to.isFolding = false;
};

const onArrange2 = (
  node: Treenode
  , from: {
    id: string
    , node: Treenode
  }
  , to: {
    id: string
    , node: Treenode
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

const onClickExport = (event: MouseEvent, node: Treenode) => {
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
  )
    template(v-slot="slotProps")
      template(v-if="slotProps.depth===0")
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
  )
    template(v-slot="slotProps")
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
</style>