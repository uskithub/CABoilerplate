<script setup lang="ts">
// service
import { Boot } from "@/shared/service/application/usecases/boot";
import type { BootScenario } from "@/shared/service/application/usecases/boot";
// view
import tree from "./components/organisms/tree.vue";

// system
import { inject, reactive } from "vue";
import type { ViewModels } from "../models";
import { VIEW_MODELS_KEY } from "../models";
import { SignInStatus } from "@/shared/service/domain/interfaces/authenticator";
import type { Treenode } from "@/shared/system/interfaces/treenode";

const { shared, user, dispatch } = inject(VIEW_MODELS_KEY) as ViewModels;

// const state = reactive<{
//     signInStatus: SignInStatus|null;
// }>({
//     signInStatus: null
// });

if (user.store.signInStatus === null && shared.user === null) {
  dispatch({ scene: Boot.userOpensSite } as BootScenario);
}

const treeContent = {
  id: "1"
  , name: "root"
  , subtrees: [
    {
      id: "11"
      , name: "subtree1"
      , subtrees: [
        {
          id: "111"
          , name: "subtree1-1"
          , subtrees: []
          , isDraggable: true
          , isFolding: true
        } as Treenode
        , {
          id: "112"
          , name: "subtree1-2"
          , subtrees: []
          , isDraggable: true
          , isFolding: true
        } as Treenode
        , {
          id: "113"
          , name: "subtree1-3"
          , subtrees: [
            {
              id: "1131"
              , name: "subtree1-3-1"
              , subtrees: []
              , isDraggable: true
              , isFolding: true
            } as Treenode
            , {
              id: "1132"
              , name: "subtree1-3-2"
              , subtrees: []
              , isDraggable: true
              , isFolding: true
            } as Treenode
            , {
              id: "1133"
              , name: "subtree1-3-3"
              , subtrees: []
              , isDraggable: true
              , isFolding: true
            } as Treenode

          ]
          , isDraggable: true
          , isFolding: true
        } as Treenode

      ]
      , isDraggable: true
      , isFolding: true
    } as Treenode
    , {
      id: "12"
      , name: "subtree2"
      , subtrees: []
      , isDraggable: true
      , isFolding: true
    } as Treenode
    , {
      id: "13"
      , name: "subtree3"
      , subtrees: []
      , isDraggable: false
      , isFolding: true
    } as Treenode
  ]
  , isDraggable: true
  , isFolding: true
} as Treenode;

const state = reactive<{
  treeContent: Treenode;
}>({
  treeContent
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
}

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
    :node="state.treeContent"
    @arrange="onArrange"
  )
    template(v-slot="slotProps")
      span {{ slotProps.node.id }}
</template>
