<script setup lang="ts">
// system
import { inject } from "vue";
import type { ViewModels } from "../viewModels";
import { VIEW_MODELS_KEY } from "../viewModels";

const { shared, createHomeViewModel } = inject(VIEW_MODELS_KEY) as ViewModels;
const { local, boot } = createHomeViewModel(shared);

if (shared.user === null) {
    boot();
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
