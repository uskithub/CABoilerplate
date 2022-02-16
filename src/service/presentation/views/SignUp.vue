<script setup lang="ts">
// system
import { inject } from "vue";
import type { ViewModels } from "../viewModels";
import { VIEW_MODELS_KEY } from "../viewModels";

const { store, createSignUpViewModel } = inject(VIEW_MODELS_KEY) as ViewModels;

const {
    state
    , emailRules
    , passwordRules
    , signUp
} = createSignUpViewModel();

</script>

<template lang="pug">
v-container
  v-app-bar(app)
    v-toolbar-title ホーム
  h1 SignUp

  v-form(ref="form" v-model="state.isValid" lazy-validation)
    v-text-field(
      v-model="state.email"
      :rules="emailRules"
      label="Mail Address"
      required
    )
    v-text-field(
      v-model="state.password"
      :rules="passwordRules"
      label="Password"
      required
    )

    v-btn(
        :disabled="!state.isValid"
        color="success"
        class="mr-4"
        @click="signUp"
    ) Sign Up
</template>
