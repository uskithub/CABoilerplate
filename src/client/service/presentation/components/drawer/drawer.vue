<script setup lang="ts">
// system
import { reactive, watch } from "vue";
import { DrawerContentType } from ".";
import type { DrawerItem } from ".";
import { SignInStatus } from "@/shared/service/domain/interfaces/authenticator";
import { computed } from "vue";

const props = defineProps<{
    modelValue: boolean
    , signInStatus: SignInStatus
    , items: Array<DrawerItem>
}>();

const emits = defineEmits<{
    (e: "update:modelValue", isOpen: boolean): void
}>();

const state = reactive<{
    isOpen: boolean;
    openings: Array<string>;
}>({
    isOpen: props.modelValue
    , openings: []
});

watch(() => props.modelValue, (newVal: boolean) => {
    state.isOpen = newVal;
});

const photoUrl = computed((): string | null => {
    switch (props.signInStatus.case) {
        case SignInStatus.signIn:
            return props.signInStatus.userProperties.photoUrl;
        default:
            return null;
    }
});

const displayName = computed((): string | null => {
    switch (props.signInStatus.case) {
        case SignInStatus.signIn:
            return props.signInStatus.userProperties.displayName;
        default:
            return null;
    }
});

</script>

<template lang="pug">
v-navigation-drawer(
  v-model="state.isOpen" 
  @update:model-value="emits('update:modelValue', state.isOpen)"
)
  v-sheet.pa-4(color="grey-lighten-4")
    v-list-item.px-2
      v-list-item-avatar
        v-img(:src="photoUrl")
      v-list-item-title {{ displayName }}
  v-divider
  v-list(nav v-model:opened="state.openings")
    template(v-for="(item, idx) in props.items")
      v-list-subheader(v-if="item.case === DrawerContentType.header") {{ item.title }}
      v-divider(v-else-if="item.case === DrawerContentType.divider")
      v-list-group(v-else-if="item.case === DrawerContentType.group" :value="item")
        template(v-slot:activator="{ props }")
          v-list-item(v-bind="props" :title="item.title")
        template(v-for="(child, idx2) in item.children")  
          v-list-subheader(v-if="child.case === DrawerContentType.header") {{ child.title }}
          v-divider(v-else-if="child.case === DrawerContentType.divider")
          v-list-item(v-else 
            :key="`${idx}.${idx2}`"
            :value="child"
            :title="child.title"
            :to="child.href"
            color="primary"
            rounded="xl"
          )
      v-list-item(v-else 
        :key="idx"
        :value="item"
        :title="item.title"
        :to="item.href"
        color="primary"
        rounded="xl"
      )
</template>
