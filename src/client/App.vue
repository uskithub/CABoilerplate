<script setup lang="ts">
import { inject } from "vue";
import { useRouter } from "vue-router";
import { DISPATCHER_KEY } from "./service/application/performers";
import type { Dispatcher } from "./service/application/performers";
import { watch } from "vue";

const { stores } = inject<Dispatcher>(DISPATCHER_KEY)!;
const router = useRouter();

watch(() => stores.shared.currentRouteLocation, (newValue, oldValue) => {
  console.log("★☆★☆★current", oldValue, "--->", newValue);
  router.replace(newValue);
});

</script>
<template lang="pug">
v-app(id="inspire")
  router-view
</template>