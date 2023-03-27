<script setup lang="ts">
// service

// system
import { DICTIONARY_KEY } from "@shared/system/localizations";
import type { Dictionary } from "@shared/system/localizations";
import { computed, inject, reactive, watch } from "vue";
import type { BehaviorController } from "../../application/behaviors";
import { BEHAVIOR_CONTROLLER_KEY } from "../../application/behaviors";
import { DrawerContentType } from "./drawer";
import type { DrawerItem } from "./drawer";

const t = inject(DICTIONARY_KEY) as Dictionary;
const { stores, dispatch } = inject(BEHAVIOR_CONTROLLER_KEY) as BehaviorController;

const props = defineProps<{
  isOpen: boolean
  , items: Array<DrawerItem>
}>();

const state = reactive<{
  isOpen: boolean;
}>({
  isOpen: props.isOpen
});

watch(() => props.isOpen, (newVal: boolean) => {
  state.isOpen = newVal;
});

</script>

<template lang="pug">
v-navigation-drawer(v-model="state.isOpen")
  v-list(dense)
    template(v-for="item in props.items")
      v-layoutv-list-subheader(
        v-if="item.type === DrawerContentType.header"
      ) {{ item.title }}
      v-divider(v-else-if="item.type === DrawerContentType.divider")
      router-link(v-else :to="item.href" :key="item.title")
        v-list-tile-content
          v-list-tile-title {{ item.title }}
</template>
