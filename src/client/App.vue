<script setup lang="ts">
import { provide } from "vue";
import { BEHAVIOR_CONTROLLER_KEY, createBehaviorController } from "@/client/service/application/behaviors";
import { SignInStatus } from "@/shared/service/domain/interfaces/authenticator";
import { Boot } from "@/shared/service/application/usecases/nobody/boot";

const controller = createBehaviorController();
provide(BEHAVIOR_CONTROLLER_KEY, controller);

const { stores, dispatch } = controller;

console.log("APPPPP");

if (stores.shared.signInStatus === SignInStatus.unknown) {
  dispatch({ scene: Boot.userOpensSite });
}
</script>

<template lang="pug">
v-app(id="inspire")
  router-view
</template>