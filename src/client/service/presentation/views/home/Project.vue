<script setup lang="ts">
// service

// view
// system
import { inject, reactive, watch } from "vue";
import type { Dispatcher } from "../../../application/performers";
import { DISPATCHER_KEY } from "../../../application/performers";

import { useRoute } from "vue-router";
import type { RouteLocationNormalizedLoaded } from "vue-router";

const { stores, dispatch } = inject(DISPATCHER_KEY) as Dispatcher;

const route = useRoute();
const { projectId } = route.params;

console.log("★★★★projectId", projectId);

const state = reactive<{
    projectId: string | string[];
}>({
    projectId
});


// Projectページ間で遷移した場合は params は watach で取得する
watch(route, (newVal: RouteLocationNormalizedLoaded) => {
    if (!newVal.path.startsWith("/projects/")) {
        // 別ページへの遷移時
        return;
    }
    // Projectページ間での遷移
    console.log("★☆☆★projectId", newVal.params.projectId);
    state.projectId = newVal.params.projectId;
});



</script>

<template lang="pug">
v-container
  span ほげほげ {{ state.projectId }}
  
</template>

<style lang="sass" scoped>
</style>