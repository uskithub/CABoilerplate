<script setup lang="ts">
// service

// view
import drawer from "../components/drawer/drawer.vue";
import { DrawerContentType } from "../components/drawer";
import type { DrawerItem } from "../components/drawer";

// system
import { inject, reactive, ref } from "vue";
import type { Dispatcher } from "../../application/performers";
import { DISPATCHER_KEY } from "../../application/performers";
import "vue3-tree/style.css";



const { stores, dispatch } = inject(DISPATCHER_KEY) as Dispatcher;

// const state = reactive<{
//     signInStatus: SignInStatus|null;
// }>({
//     signInStatus: null
// });

const items: Array<DrawerItem> = [
    { type: DrawerContentType.header, title: "Menu1" } as DrawerItem
    , { type: DrawerContentType.link, title: "保証一覧", href: "/warranties" } as DrawerItem
    , { type: DrawerContentType.link, title: "保険加入アイテム", href: "/insuranceItems" } as DrawerItem
    , { type: DrawerContentType.divider } as DrawerItem
    , { type: DrawerContentType.header, title: "Menu2" } as DrawerItem
    , { type: DrawerContentType.link, title: "タスク一覧", href: "/" } as DrawerItem
    , { type: DrawerContentType.link, title: "link3", href: "/link3" } as DrawerItem
];

const state = reactive<{
    isDrawerOpen: boolean;
}>({
    isDrawerOpen: true
});

</script>

<template lang="pug">
drawer(v-model="state.isDrawerOpen", :items="items")
v-app-bar
  v-app-bar-nav-icon(@click="state.isDrawerOpen = !state.isDrawerOpen")
  v-toolbar-title Application
v-main
  router-view
</template>

<style lang="sass" scoped></style>