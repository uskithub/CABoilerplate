<script setup lang="ts">
import { inject, reactive } from "vue";
import type { Dispatcher } from "../../application/performers";
import { DISPATCHER_KEY } from "../../application/performers";

const { stores, dispatch } = inject<Dispatcher>(DISPATCHER_KEY)!;

const state = reactive<{

}>({

});

</script>

<template lang="pug">
v-container
  span ほげほげ
  
</template>

<style lang="sass" scoped>
</style>