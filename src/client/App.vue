<script setup lang="ts">
import { provide } from "vue";
import { DISPATCHER_KEY, createDispatcher } from "@/client/service/application/performers";
import { SignInStatus } from "@/shared/service/domain/interfaces/authenticator";
import { U } from "@/shared/service/application/usecases";
import { NobodyUsecases } from "@/shared/service/application/usecases/nobody";

const dispatcher = createDispatcher();
provide(DISPATCHER_KEY, dispatcher);

const { stores, dispatch } = dispatcher;

console.log("APPPPP");

if (stores.shared.signInStatus === SignInStatus.unknown) {
  const u = U.boot.basics[NobodyUsecases.boot.basics.userOpensSite]();
    dispatch(u);
}
</script>

<template lang="pug">
v-app(id="inspire")
  router-view
</template>