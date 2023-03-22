<script setup lang="ts">
import { provide } from "vue";
import { BEHAVIOR_CONTROLLER_KEY, createBehaviorController } from "@/client/service/application/behaviors";

const controller = createBehaviorController();
provide(BEHAVIOR_CONTROLLER_KEY, controller);
</script>

<template lang="pug">
v-app
  v-main
    router-view
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
