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
import { ListInsuranceItems } from "@/shared/service/application/usecases/ServiceInProcess/signedInUser/listInsuaranceItems";


const { stores, dispatch } = inject(BEHAVIOR_CONTROLLER_KEY) as BehaviorController;

dispatch({ scene: ListInsuranceItems.userInitiatesListing });

</script>

<template lang="pug">
v-container
  
</template>

<style lang="sass" scoped></style>