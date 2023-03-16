<script setup lang="ts">
import { provide } from "vue";
import { BEHAVIOR_MODELS_KEY, createBehaviorModels } from "@client/service/presentation/models";

const behaviorModels = createBehaviorModels();
provide(BEHAVIOR_MODELS_KEY, behaviorModels);
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
