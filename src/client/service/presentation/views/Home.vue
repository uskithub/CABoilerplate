<script setup lang="ts">
// service

// view
import drawer from "../components/drawer/drawer.vue";

// system
import { inject, reactive, ref } from "vue";
import type { Dispatcher } from "../../application/performers";
import { DISPATCHER_KEY } from "../../application/performers";
import "vue3-tree/style.css";

const { stores, dispatch } = inject<Dispatcher>(DISPATCHER_KEY)!;

// const state = reactive<{
//     signInStatus: SignInStatus|null;
// }>({
//     signInStatus: null
// });

const state = reactive<{
    isDrawerOpen: boolean;
}>({
    isDrawerOpen: true
});

</script>

<template lang="pug">
drawer(v-model="state.isDrawerOpen", :items="stores.application.drawerItems")
v-app-bar
  v-app-bar-nav-icon(@click="state.isDrawerOpen = !state.isDrawerOpen")
  v-toolbar-title Application
v-main
  router-view
</template>

<style lang="sass" scoped></style>