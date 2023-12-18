<script setup lang="ts">
// service

// view
// system
import { inject, reactive, watch } from "vue";
import type { Dispatcher, SharedStore } from "../../../application/performers";
import { DISPATCHER_KEY } from "../../../application/performers";
import { U } from "@/shared/service/application/usecases";

import { useRoute } from "vue-router";
import type { RouteLocationNormalizedLoaded } from "vue-router";
import { AuthorizedUser } from "@/shared/service/application/actors/authorizedUser";
import { type Account } from "@/shared/service/domain/authentication/user";
import type { Actor } from "@/shared/service/application/actors";
import { whenNoLongerNull } from "@/client/system/common";

const { stores, dispatch } = inject<Dispatcher>(DISPATCHER_KEY)!;

const route = useRoute();
const { projectId } = route.params;

console.log("★★★★projectId", projectId);

const state = reactive<{
    projectId: string;
}>({
    projectId: (Array.isArray(projectId)) ? projectId[0] : projectId
});

// Projectページ間で遷移した場合は params は watach で取得する
watch(route, (newVal: RouteLocationNormalizedLoaded) => {
    if (!newVal.path.startsWith("/projects/")) {
        // 別ページへの遷移時
        return;
    }
    // Projectページ間での遷移
    const { projectId } = newVal.params;
    console.log("★☆☆★projectId", projectId);
    state.projectId = (Array.isArray(projectId)) ? projectId[0] : projectId;
});

whenNoLongerNull(() => stores.shared.actor.user, (user: Account) => {
    dispatch(U.projectManagement.observingProject.basics[AuthorizedUser.usecases.observingProject.basics.userSelectsAProject]({ user, projectId: state.projectId }));
});

</script>

<template lang="pug">
v-container
  span ほげほげ {{ state.projectId }}
  
</template>

<style lang="sass" scoped>
</style>