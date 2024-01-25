<script setup lang="ts">
// service
import { TaskTreenode } from "../../models/taskTreenode";
import { Task, TaskType } from "@/shared/service/domain/taskManagement/task";
import type { TaskProperties } from "@/shared/service/domain/taskManagement/task";

// view
import { tree, findNodeById } from "vue3-tree";

// system
import type { Service } from "@/client/service/application/performers";
import { SERVICE_KEY } from "@/client/service/application/performers";
import { Syncable } from "@/client/system/common";
import { inject, reactive } from "vue";
import type { TreeEventHandlers } from "vue3-tree";
import "vue3-tree/style.css";

const { stores, dispatch } = inject<Service>(SERVICE_KEY)!;

// custom directive for autofocus
const vFocus = {
    mounted: (el: HTMLElement) => el.focus()
};

const state = reactive<{
    usersTasks: Syncable<TaskProperties[]>;
}>({
    usersTasks: new Syncable(stores.taskManagement.usersTasks)
});


</script>

<template lang="pug">
v-container
  template(v-for="task in state.usersTasks.value", :key="task.id")
    div {{ task.title }}
  
</template>

<style lang="sass" scoped></style>