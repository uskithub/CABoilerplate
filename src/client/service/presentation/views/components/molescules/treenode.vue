<script setup lang="ts">
import type { Treenode } from "@/shared/system/interfaces/treenode";
import { TreenodeType } from "@/shared/system/interfaces/treenode";
import { computed, nextTick, reactive } from "vue";
// import type { PropType } from "vue";

const props = defineProps<{
  parent: Treenode | undefined
  , node: Treenode
}>();

// ↓の書き方でもOK
// const props = defineProps({
//   parent: {
//     type: Object as PropType<Treenode>|undefined
//   }
//   , node: {
//     type: Object as PropType<Treenode>
//   }
// });

// @note: stateを一箇所に集めないと処理上の様々なな判断が困難なため、stateの保持および処理はRootコンポーネント（tree）で行い、
//        子ノード（treenode）ではイベントを発火させるだけとする。記述を簡潔にするためにコンポーネントを分けて実装する。

const emit = defineEmits<{
  (e: "dragenter", event: MouseEvent, node: Treenode): void,
  (e: "dragstart", event: MouseEvent, parent: Treenode, node: Treenode): void,
  (e: "dragend", event: MouseEvent, node: Treenode): void,
}>();

const onDragenter = (e: MouseEvent, treenode: Treenode) => {
  emit("dragenter", e, treenode);
  e.stopPropagation();
};

const onDragstart = (e: MouseEvent, parent: Treenode, treenode: Treenode) => {
  emit("dragstart", e, parent, treenode);
  e.stopPropagation();
};

const onDragend = (e: MouseEvent, treenode: Treenode) => {
  emit("dragend", e, treenode);
  e.stopPropagation();
};


</script>

<template lang="pug">
ul.subtree(
  :data-type="TreenodeType.descendant"
  :data-id="props.node.id"
  @dragenter="onDragenter($event, props.node)"
)
  li(
    v-for="childnode in props.node.subtrees",
    :key="childnode.id", 
    :data-id="childnode.id", 
    :draggable="childnode.isDraggable"
    @dragstart="onDragstart($event, props.node, childnode)"
    @dragend="onDragend($event, childnode)"
  )
    .tree-item
      span {{ childnode.name + '(' + childnode.id + ')' }}
    treenode(
      :parent="props.node",
      :node="childnode"
      @dragstart="onDragstart"
      @dragend="onDragend"
      @dragenter="onDragenter"
    )
</template>