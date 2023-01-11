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

const onArrange = (
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
  // 元親から削除
  from.node.subtrees = from.node.subtrees.filter((subtree) => subtree.id !== node.id);
  // 新親に追加
  to.node.subtrees.splice(index, 0, node);
  to.node.isFolding = true;
};

const onToggleFolding = (node: Treenode) => {
  node.isFolding = !node.isFolding;
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
    @arrange="onArrange"
    @toggle-folding="onToggleFolding"
  )
    template(v-slot="slotProps")
      span.header(v-if="slotProps.depth === 0") {{ slotProps.node.name }}
      span.title(v-else) {{ slotProps.node.name }}
  br
  tree(
    :node="state.swtTree"
    @arrange="onArrange"
    @toggle-folding="onToggleFolding"
  )
    template(v-slot="slotProps")
      span.header(v-if="slotProps.depth === 0") {{ slotProps.node.name }}
      span.title(v-else) {{ slotProps.node.name }}
</template>

<style lang="sass" scoped>
.tree
  :deep(li)
    .tree-header
      > .header
        font-weight: bold
    .tree-item
      border-left: 5px solid transparent
    &.milestone
      color: #22559c
      > .tree-item
        border-left: 5px solid #ede862
        > .title:before
          font-family: "Material Design Icons"  
          color: #ede862
          content: "\F023B  "
    &.requirement
      > .tree-item
        border-left: 5px solid #f27370
</style>