<script setup lang="ts">
import { DICTIONARY_KEY } from "@shared/system/localizations";
import type { Dictionary } from "@shared/system/localizations";
import { inject, reactive, ref } from "vue";
import type { Service } from "../../../application/performers";
import { SERVICE_KEY } from "../../../application/performers";
import { Role } from "@/shared/service/domain/chat/message";
import type { MessageProperties } from "@/shared/service/domain/chat/message";
import { R } from "@/shared/service/application/usecases";

const t = inject<Dictionary>(DICTIONARY_KEY)!;
const { stores, dispatch } = inject<Service>(SERVICE_KEY)!;

const state = reactive<{
    inputText: string;
}>({
    inputText: ""
});

const items = [
        { type: 'subheader', title: 'Today' },
        {
          prependAvatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
          title: 'Brunch this weekend?',
          subtitle: `<span class="text-primary">Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?`,
        },
        { type: 'divider', inset: true },
        {
          prependAvatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
          title: 'Summer BBQ',
          subtitle: `<span class="text-primary">to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend.`,
        },
        { type: 'divider', inset: true },
        {
          prependAvatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
          title: 'Oui oui',
          subtitle:
            '<span class="text-primary">Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?',
        },
        { type: 'divider', inset: true },
        {
          prependAvatar: 'https://cdn.vuetifyjs.com/images/lists/4.jpg',
          title: 'Birthday gift',
          subtitle:
            '<span class="text-primary">Trevor Hansen</span> &mdash; Have any ideas about what we should get Heidi for her birthday?',
        },
        { type: 'divider', inset: true },
       {
          prependAvatar: 'https://cdn.vuetifyjs.com/images/lists/5.jpg',
          title: 'Recipe to try',
          subtitle:
            '<span class="text-primary">Britta Holt</span> &mdash; We should eat this: Grate, Squash, Corn, and tomatillo Tacos.',
        },
      ];

</script>

<template lang="pug">
v-container
  v-list(:items="items" item-props lines="three")
    template(v-slot:subtitle="{ subtitle }")
       div(v-html="subtitle")
  v-bottom-sheet
    template(v-slot:activator="{ props }")
      v-btn(v-bind="props" text="仕様")
    v-card(
      title="仕様メモ"
    )
      v-card-text 自分の全行動／1:1のメッセージ／所属グループへのメッセージを表示

</template>
<style lang="sass" scoped></style>