<script setup lang="ts">
// service

// view

// system
import { inject, reactive, ref } from "vue";
import type { BehaviorController } from "../../../application/behaviors";
import { BEHAVIOR_CONTROLLER_KEY } from "../../../application/behaviors";

const { stores, dispatch } = inject(BEHAVIOR_CONTROLLER_KEY) as BehaviorController;


// const state = reactive<{
//   isDrawerOpen: boolean;
// }>({
//   isDrawerOpen: true
// });

</script>

<template lang="pug">
v-container
  | hoge
</template>

<style lang="sass" scoped></style>