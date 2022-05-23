<script setup lang="ts">
// service
import { Boot } from "@/shared/service/application/usecases/boot";
import type { BootScenario } from "@/shared/service/application/usecases/boot";
// system
import { inject } from "vue";
import type { ViewModels } from "../models";
import { VIEW_MODELS_KEY } from "../models";

const { shared, dispatch } = inject(VIEW_MODELS_KEY) as ViewModels;

if (shared.user === null) {
    dispatch({ scene: Boot.userOpensSite } as BootScenario);
}

</script>

<template lang="pug">
v-container
  h1 Home {{ shared.user?.mailAddress }}
  ul
    li
      router-link(to="/signin") -> SignIn
    li
      router-link(to="/signup") -> SignUp
</template>
