<script setup lang="ts">
import { provide } from "vue";
import { CONTROLLERS_KEY, createControllers } from "@/service/presentation/controllers";

const controllers = createControllers();
provide(CONTROLLERS_KEY, controllers);

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