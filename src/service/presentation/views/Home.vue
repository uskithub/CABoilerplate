<script setup lang="ts">
// system
import { inject } from "vue";
import type { Controllers } from "@/service/presentation/controllers";
import { CONTROLLERS_KEY } from "@/service/presentation/controllers";

const controllers = inject(CONTROLLERS_KEY) as Controllers;

controllers.common.boot();

</script>

<template lang="pug">
v-container
  h1 Home
  router-link(to="/signin") -> Signin
</template>
