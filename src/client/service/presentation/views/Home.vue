<script setup lang="ts">
// service

// view
import drawer from "../components/drawer/drawer.vue";

// system
import { inject, reactive, ref } from "vue";
import type { Service } from "../../application/performers";
import { SERVICE_KEY } from "../../application/performers";
import "vue3-tree/style.css";
import { SignInStatus } from "@/shared/service/domain/interfaces/authenticator";
import { R } from "@/shared/service/application/usecases";

const { stores, dispatch } = inject<Service>(SERVICE_KEY)!;

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

if (stores.shared.signInStatus.case === SignInStatus.signOut) {
    dispatch(R.application.boot.goals.sessionNotExistsThenServicePresentsSignInView());
}

</script>

<template lang="pug">
drawer(
  v-model="state.isDrawerOpen",
  :signInStatus="stores.shared.signInStatus",
  :items="stores.application.drawerItems"
)
v-app-bar
  v-app-bar-nav-icon(@click="state.isDrawerOpen = !state.isDrawerOpen")
  v-toolbar-title Application
v-main
  router-view
</template>

<style lang="sass" scoped></style>