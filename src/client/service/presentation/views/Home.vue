<script setup lang="ts">
// system
import { inject } from "vue";
import type { ViewModels } from "@viewModels/index";
import { VIEW_MODELS_KEY } from "@viewModels/index";

const { store, createHomeViewModel } = inject(VIEW_MODELS_KEY) as ViewModels;

const {
    state
    , boot
} = createHomeViewModel(store);

boot();

</script>

<template lang="pug">
v-container
  h1 Home
  ul
    li
      router-link(to="/signin") -> SignIn
    li
      router-link(to="/signup") -> SignUp
</template>
