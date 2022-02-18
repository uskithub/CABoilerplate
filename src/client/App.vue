<script setup lang="ts">
import { provide } from "vue";
import { VIEW_MODELS_KEY, createViewModels } from "@viewModels/index";

const viewModels = createViewModels();
provide(VIEW_MODELS_KEY, viewModels);

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
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>