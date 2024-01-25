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

const myTaskTreenodes = computed(() => {
    return state.usersTasks.value.map(task => {
        return new TaskTreenode(task);
    });
});

</script>

<template lang="pug">
v-container
  template(v-for="taskTreenode in myTaskTreenodes", :key="taskTreenode.id")
    tree(
      :node="taskTreenode"
    )
      template(v-slot="slotProps")
        input(
          v-if="slotProps.isEditing"
          v-model="slotProps.node.name"
          v-focus
          @blur="() => { if (slotProps.endEditing) slotProps.endEditing(slotProps.node.name); }"
        )
        template(v-else-if="slotProps.depth===0")
          span.header {{ slotProps.node.name }}
          v-icon(
            v-show="slotProps.isHovering" 
            icon="mdi:mdi-export-variant"
          )
        span.title(v-else) {{ slotProps.node.name }}
  
</template>

<style lang="sass" scoped></style>