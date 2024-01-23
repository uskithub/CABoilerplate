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

const photoUrl = computed((): string | undefined => {
    switch (props.signInStatus.case) {
        case SignInStatus.signIn:
            return props.signInStatus.userProperties.photoUrl ?? undefined;
        default:
            return undefined;
    }
});

const displayName = computed((): string | undefined => {
    switch (props.signInStatus.case) {
        case SignInStatus.signIn:
            return props.signInStatus.userProperties.displayName ?? undefined;
        default:
            return undefined;
    }
});

const status = "TODO:ステータスを表示";

</script>

<template lang="pug">
v-navigation-drawer(
  v-model="state.isOpen" 
  @update:model-value="emits('update:modelValue', state.isOpen)"
)
  v-list(bg-color="grey-lighten-4")
    v-list-item(
      :title="displayName"
      :subtitle="status"
      to="/profile"
    )
      template(v-slot:prepend)
        v-avatar(size="x-large")
          v-img(
            v-if="photoUrl"
            :src="photoUrl"
            :alt="displayName"
          )
          span.text-h5(v-else) {{ displayName }}
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
  v-bottom-sheet
    template(v-slot:activator="{ props }")
      v-btn(v-bind="props" text="設計思想")
    v-card(
      title="設計思想メモ"
    )
      v-card-text 組織がゆるくなる時代、個人は複数の組織にパートタイムでジョインすることが当たり前になった。そこで問題となるのが個人のタスク管理。
      v-card-text 1. タスクはプロジェクトや組織を超えてマネジメントされるべき。
      v-card-text 2. タスクはできるだけ多くのコンテキストを見える化できるべき。
      v-card-text 3. コンテキストは情報量を落とさずにできるだけ要約されるべき。
</template>
