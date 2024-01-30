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
import { computed } from "vue";
import { watch } from "vue";

const { stores, dispatch } = inject<Service>(SERVICE_KEY)!;

// custom directive for autofocus
const vFocus = {
    mounted: (el: HTMLElement) => el.focus()
};

const state = reactive<{
    usersTasks: Syncable<TaskProperties>[];
}>({
    usersTasks: stores.taskManagement.usersTasks.map(t => new Syncable(t))
}) as {
    usersTasks: Syncable<TaskProperties>[];
};

watch(stores.taskManagement.usersTasks, (newVal, oldVal) => {
    console.log("usersTasks changed", newVal, oldVal);
    state.usersTasks = newVal.map(t => new Syncable(t));
});

const treenodes = computed((): TaskTreenode[] => {
    return state.usersTasks.map((t: Syncable<TaskProperties>) => new TaskTreenode(t.value));
});

</script>

<template lang="pug">
v-container
  template(v-for="tasknode in treenodes", :key="tasknode.id")
    tree(
      :node="tasknode"
      @update-name="(id: string, newValue: string) => { tasknode.name = newValue; }"
    )
  
</template>

<style lang="sass" scoped></style>