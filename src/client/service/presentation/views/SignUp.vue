<script setup lang="ts">
// system
import { inject } from "vue";
import { DICTIONARY_KEY } from "@shared/system/localizations";
import type { Dictionary } from "@shared/system/localizations";
import { VIEW_MODELS_KEY } from "../viewModels";
import type { ViewModels } from "../viewModels";

const t = inject(DICTIONARY_KEY) as Dictionary;
const { store, createSignUpViewModel } = inject(VIEW_MODELS_KEY) as ViewModels;
const { state, signUp } = createSignUpViewModel(store);


</script>

<template lang="pug">
v-container
  v-app-bar(app)
    v-toolbar-title {{ t.signUp.title }}
  h1 {{ t.signUp.title }}

  v-form(ref="form", v-model="state.isValid", lazy-validation)
    v-text-field(
      v-model="state.email",
      :error-messages="state.idInvalidMessage",
      :label="t.common.labels.mailAddress",
      required
    )
    span(v-if="state.idInvalidMessage !== null") {{ state.idInvalidMessage }}
    v-text-field(
      v-model="state.password",
      :error-messages="state.passwordInvalidMessage",
      :label="t.common.labels.password",
      required
    )
    span(v-if="state.passwordInvalidMessage !== null") {{ state.passwordInvalidMessage }}
    v-btn.mr-4(
      :disabled="!state.isValid",
      color="success",
      @click="signUp(state.email, state.password)"
    ) {{ t.signUp.buttons.signUp }}
</template>
