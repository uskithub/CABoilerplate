<script setup lang="ts">
// service

// view
import DataTable from "../../components/dataTable/dataTable.vue";
import { Align } from "../../components/dataTable";
import type { Action, DataTableHeader } from "../../components/dataTable";

// system
import { inject, reactive, ref } from "vue";
import type { BehaviorController } from "../../../application/behaviors";
import { BEHAVIOR_CONTROLLER_KEY } from "../../../application/behaviors";
import { ListInsuranceItems } from "@/shared/service/application/usecases/ServiceInProcess/signedInUser/listInsuranceItems";


const { stores, dispatch } = inject(BEHAVIOR_CONTROLLER_KEY) as BehaviorController;



const state = reactive<{
    isPresentDialog: boolean;
}>({
    isPresentDialog: false
});


dispatch({ scene: ListInsuranceItems.userInitiatesListing });

const onClickAddButton = () => {
    state.isPresentDialog = true;
};

</script>

<template lang="pug">
v-container
 v-card
  v-toolbar(dense, flat)
    v-toolbar-title 保険一覧
    template(v-slot:append)
      v-btn(icon="mdi:mdi-plus" @click="onClickAddButton")
v-row(justify="center")
  v-dialog(v-model="state.isPresentDialog", persistent, max-width="800")
    v-card
      v-card-title.text-h5 Use Google's location service?
      v-card-text Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.
      v-card-actions
        v-spacer
        v-btn(
          color="warning",
          text,
        ) Sign Out
        v-btn(
          color="success",
          text,
        ) Go Home
</template>

<style lang="sass" scoped></style>