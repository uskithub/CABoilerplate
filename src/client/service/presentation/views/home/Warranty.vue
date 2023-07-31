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
import { SignInUserUsecases } from "@/shared/service/application/usecases/signedInUser";


const { stores, dispatch } = inject(DISPATCHER_KEY) as Dispatcher;

dispatch(U.getWarrantyList.basics[SignInUserUsecases.getWarrantyList.basics.userInitiatesWarrantyListing]()); 

// const state = reactive<{
//   isDrawerOpen: boolean;
// }>({
//   isDrawerOpen: true
// });

const headers: Array<DataTableHeader> = [
    { title: "保証番号", key: "hoshonum" } as DataTableHeader
    , { title: "保証料", key: "hosyoryo", align: "end" } as DataTableHeader
    , { title: "保証印日付", key: "hoshoindate", value: (item) => `${String(item.hoshoindate.getFullYear()).padStart(4, "0")}-${String(item.hoshoindate.getMonth() + 1).padStart(2, "0")}-${String(item.hoshoindate.getDate()).padStart(2, "0")}` } as DataTableHeader
];

const rows = [
    { hoshonum: "200001", hosyoryo: "1000", hoshoindate: new Date("2023-03-01") }
    , { hoshonum: "200002", hosyoryo: "10000", hoshoindate: new Date("2023-03-01") }
    , { hoshonum: "200003", hosyoryo: "-1000", hoshoindate: new Date("2023-03-01") }
];

const actions = new Array<Action>();

</script>

<template lang="pug">
v-container
  dataTable(:headers="headers", :rows="rows", :actions="actions")
</template>

<style lang="sass" scoped></style>