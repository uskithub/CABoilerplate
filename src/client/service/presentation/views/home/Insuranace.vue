<script setup lang="ts">
// service

// view
import DataTable from "../../components/dataTable/dataTable.vue";
import { Align } from "../../components/dataTable";
import type { Action, DataTableHeader } from "../../components/dataTable";

// system
import { inject, reactive, ref } from "vue";
import type { Dispatcher } from "../../../application/performers";
import { DISPATCHER_KEY } from "../../../application/performers";
import { U } from "@/shared/service/application/usecases";
import { SignedInUser } from "@/shared/service/application/actors/signedInUser";


const { stores, dispatch } = inject(DISPATCHER_KEY) as Dispatcher;



const state = reactive<{
    isPresentDialog: boolean;
    isAddingNewPolicy: boolean;
}>({
    isPresentDialog: false
    , isAddingNewPolicy: false
});

dispatch(U.listInsuranceItems.basics[SignedInUser.usecases.listInsuranceItems.basics.userInitiatesListing]()); 

const onClickAddButton = () => {
    state.isPresentDialog = true;
};

</script>

<template lang="pug">
v-container
 v-card
  v-toolbar(dense, flat)
    v-toolbar-title 保険加入アイテム一覧
    template(v-slot:append)
      v-btn(icon="mdi:mdi-plus" @click="onClickAddButton")
v-row(justify="center")
  v-dialog(v-model="state.isPresentDialog", persistent, max-width="800")
    v-card
      v-card-title.text-h5 保険加入アイテムを追加
      v-card-text
        v-container
          v-row
            v-col
              v-autocomplete(
                label="製品カテゴリ"
                :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
              )
          v-row
            v-col
              v-autocomplete(
                label="保険期間"
                :items="['20', '19', '3', '4', '5', 'Wyoming']"
              )
          v-row
            v-col
              v-autocomplete(
                label="ポリシー"
                :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
              )
      v-card-actions
        v-spacer
        v-btn(
          variant="outlined"
          size="large"
          prepend-icon="mdi-close"
          @click="state.isPresentDialog = false"
        ) 閉じる
        v-spacer
        v-btn(
          variant="outlined"
          size="large"
          prepend-icon="mdi-check"
          text,
        ) 追加する
        v-spacer
</template>

<style lang="sass" scoped></style>