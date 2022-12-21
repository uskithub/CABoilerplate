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

const emits = defineEmits<{
  (e: "arrange", params: {
    node: Treenode
    , from: {
      type: string
      , id: string
      , entity: Treenode
    }
    , to: {
      type: string
      , id: string
      , entity: Treenode
    }
    , index: number
  }): void
}>();

/**
 * target が ofElem 自身かその子孫の場合 true を返します。
 * @param target 
 * @param ofElem 
 */
const isMyselfOrDescendant = (targetUl: HTMLElement, ofElem: HTMLElement) => {
  if (targetUl == ofElem) {
    return true;
  }
  if (ofElem.childNodes) {
    for (const i in ofElem.childNodes) {
      const child = ofElem.childNodes[i];
      if (child instanceof HTMLElement && isMyselfOrDescendant(targetUl, child)) {
        return true;
      }
    }
  }
  return false;
};

const getInsertingIntersiblings = (newParent: HTMLElement, x: number, y: number): Array<HTMLElement | null> => {
  const len = newParent.children.length;
  for (let i = 0; i < len; i++) {
    const child = newParent.children[i] as HTMLElement;
    const rect = child.getBoundingClientRect();
    if ((rect.top + rect.height / 2) > y) {
      if (i > 0) {
        const before = newParent.children[i - 1] as HTMLElement;
        return [before, child];
      } else {
        return [null, child];
      }
    }
  }
  return [newParent.children[len - 1] as HTMLElement, null];
};

const state = reactive<{
  dragging: {
    elem: HTMLElement;
    parent: Treenode;
    node: Treenode;
    mirage: HTMLElement;
  } | null;
  draggingOn: {
    elem: HTMLElement;
    type: string;
    id: string;
    entity: Treenode;
    siblings: Array<HTMLElement | null> | null;
  } | null;
}>({
  dragging: null
  , draggingOn: null
});

const isRoot = computed(() => {
  return props.parent === undefined;
});

/**
 * dragされた要素をdrag状態にします（スタイルを変えます）。
 * @param e 
 * @param parent 
 * @param node 
 */
const onDragstart = (e: MouseEvent, parent: Treenode, node: Treenode) => {
  const elem = e.target as HTMLElement
    , mirage = elem.cloneNode(true) as HTMLElement
    ;
  elem.classList.add("dragging");
  mirage.classList.add("dragging");

  state.dragging = {
    elem
    , parent
    , node
    , mirage
  };

  console.log("ondragstart", node);
}

/**
 * 
 * @param e 
 * @param node 
 */
const onDragenter = (e: DragEvent, node: Treenode) => {
  const elem = e.target as HTMLElement
    , type = elem.dataset.type
    , id = elem.dataset.id
    , x = e.clientX
    , y = e.clientY
    ;

  if (type === undefined || id === undefined) return;
  // dragenterした対象が、自身（dragging）の子孫のULの場合は何もしない
  if (state.dragging && isMyselfOrDescendant(elem, state.dragging.elem)) {
    console.log("===1", props.parent ? props.parent.id : "root", elem, state.dragging)
    // drag中の要素自身あるいはその子孫にdragenterしても何もしない
    return;
  }
  console.log("===2", props.parent ? props.parent.id : "root", elem, state.dragging)

  if (state.draggingOn) {
    state.draggingOn.elem.classList.remove("drop-target");
    state.draggingOn.elem.removeEventListener("dragover", onDragover);
    state.draggingOn = null;
  }

  elem.classList.add("drop-target");
  elem.addEventListener("dragover", onDragover);

  state.draggingOn = {
    elem
    , type
    , id
    , entity: node
    , siblings: null
  };

  if (state.dragging) {
    const mirage = state.dragging.mirage;
    const siblings = getInsertingIntersiblings(elem, x, y);
    if (siblings.includes(mirage)) return;
    if (mirage && mirage.parentNode) {
      mirage.parentNode.removeChild(mirage);
    }
    if (siblings.includes(state.dragging.elem)) return;
    if (siblings[1] === null && elem.children[elem.children.length - 1] === state.dragging.elem) return;

    elem.insertBefore(mirage, siblings[1]);
    state.draggingOn.siblings = siblings;
  }
};

const onDragover = (e: MouseEvent) => {
  const elem = e.currentTarget as HTMLElement
    , type = elem.dataset.type
    , id = elem.dataset.id
    , x = e.clientX
    , y = e.clientY
    ;

  if (type === undefined) return;
  if (state.dragging) {
    if (type === TreenodeType.descendant && state.dragging.elem.dataset.id === id) return;
    // drag中の要素自身あるいはその子孫にdragenterしても何もしない
    if (isMyselfOrDescendant(elem, state.dragging.elem)) return;

    const mirage = state.dragging.mirage;
    const siblings = getInsertingIntersiblings(elem, x, y);
    if (siblings.includes(mirage)) return;
    if (siblings.includes(state.dragging.elem)) return;
    if (siblings[1] === null && elem.children[elem.children.length - 1] === state.dragging.elem) return;
    if (state.draggingOn && state.draggingOn.siblings !== siblings) {
      if (mirage && mirage.parentNode) {
        mirage.parentNode.removeChild(mirage);
      }
      elem.insertBefore(mirage, siblings[1]);
      state.draggingOn.siblings = siblings;
    }
  }
};

const onDragend = (e: MouseEvent, node: Treenode) => {
  const elem = e.currentTarget as HTMLElement;
  elem.classList.remove("dragging");

  // validation
  if (state.dragging && node.id !== state.dragging.node.id) {
    state.dragging = null;
    state.draggingOn = null;
    return;
  }

  if (state.dragging && state.dragging.mirage.parentNode && state.draggingOn) {
    // treenode, from ,to
    const from = state.dragging.parent;
    const node = state.dragging.node;
    const exParent = elem.parentNode as HTMLElement;
    const newParent = state.draggingOn.elem;
    const mirage = state.dragging.mirage;

    let index = 0;
    for (let i = 0, len = newParent.children.length; i < len; i++) {
      const child = newParent.children[i];
      if (child === mirage) break;
      if (child !== elem) index++;
    }

    if (exParent.dataset.type === undefined || exParent.dataset.id === undefined) return;

    emits("arrange", {
      node
      , from: {
        type: exParent.dataset.type
        , id: exParent.dataset.id
        , entity: from
      }
      , to: {
        type: state.draggingOn.type
        , id: state.draggingOn.id
        , entity: state.draggingOn.entity
      }
      , index
    });
  }

  if (state.dragging) {
    const mirage = state.dragging.mirage;
    nextTick()
      .then(() => {
        if (mirage && mirage.parentNode)
          mirage.parentNode.removeChild(mirage);
      });
    state.dragging = null;
  }

  if (state.draggingOn) {
    const elem = state.draggingOn.elem;
    nextTick()
      .then(() => {
        elem.classList.remove("drop-target");
        elem.removeEventListener("dragover", onDragover);
      });
    state.draggingOn = null;
  }
}

</script>

<template lang="pug">
ul(
  :data-type="isRoot ? TreenodeType.root : TreenodeType.descendant"
  :data-id="isRoot ? '_tree_root' : '_subtree_' + props.node.id"
  :class="isRoot ? 'tree' : 'subtree'"
  @dragenter.prevent.stop="onDragenter($event, props.node)"
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
    tree(
      :parent="props.node",
      :node="childnode"
    )
</template>

<style lang="sass" scoped>
.tree
  list-style-type: none
  margin: 0
  padding: 0 !important

  li
    margin: 0
    padding: 0
    position: relative
    min-height: 2.5em
    overflow: hidden

    &.dragging
          opacity: 0.5

    .tree-item
      height: 2.5em
      padding: 0.5em 0.5em 0 0.5em
    .subtree
      list-style-type: none
      margin: 0.5em 0 0 1.5em
      padding: 0
      min-height: 5px
      border-top: 3px solid transparent
      border-left: 3px solid transparent

      &:empty
        margin: 0
        min-height: 7px

      &.drop-target
        border: 3px dotted #888
</style>