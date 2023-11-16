<script setup lang="ts">
// service

// view
import { Align } from "../../components/dataTable";
import type { Action, DataTableHeader } from "../../components/dataTable";

// system
import { inject, reactive, ref } from "vue";
import type { Dispatcher } from "../../../application/performers";
import { DISPATCHER_KEY } from "../../../application/performers";
import { Role } from "@/shared/service/domain/chat/message";
import type { MessageProperties } from "@/shared/service/domain/chat/message";
import { U } from "@/shared/service/application/usecases";
import { SignedInUser } from "@/shared/service/application/actors/signedInUser";


const { stores, dispatch } = inject(DISPATCHER_KEY) as Dispatcher;


const state = reactive<{
    inputText: string;
}>({
    inputText: ""
});

const onClickSendButton = () => {
    const message = {
        role: Role.user
        , content: state.inputText
    } as MessageProperties;

    dispatch(U.consult.basics[SignedInUser.usecases.consult.basics.userInputsQuery]({ messages: [ message ]})); 
};

const items = [
    {
        id: 1
        , color: "info"
        , icon: "mdi-information"
        , content: "hogehoge"
    }
    , {
        id: 2
        , color: "error"
        , icon: "mdi-alert-circle"
        , content: "fugafuga"
    }
];

const actions = new Array<Action>();

</script>

<template lang="pug">
v-container
  v-timeline(side="end")
    v-timeline-item(
      v-for="item in items"
      :key="item.id"
      :dot-color="item.color"
      size="small"
    )
      v-alert(
        :value="true"
        :color="item.color"
        :icon="item.icon"
      ) {{ item.content }}
  v-textarea(
    append-icon="mdi-comment"
    clearable
    clear-icon="mdi-close-circle"
    label="Text"
    model-value="This is clearable text."
    @click:append="onClickSendButton"
  )
</template>

<style lang="sass" scoped></style>