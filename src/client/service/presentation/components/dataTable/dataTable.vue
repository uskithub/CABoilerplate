<script setup lang="ts">
// system
import { computed, inject, reactive, watch } from "vue";
import type { SortOrder, Align, Header, Action, DataTableHeader } from ".";

const props = defineProps<{
  headers: Array<DataTableHeader>
  , rows: Array<Object>
  , actions: Array<Action>
}>();

const emits = defineEmits<{
  (e: "update:modelValue", isOpen: boolean): void
}>();

// const state = reactive<{
//   isOpen: boolean;
// }>({
//   isOpen: props.modelValue
// });

// watch(() => props.modelValue, (newVal: boolean) => {
//   state.isOpen = newVal;
// });

</script>

<template lang="pug">
v-data-table(
  :headers="props.headers"
  :items="props.rows"
)
</template>
