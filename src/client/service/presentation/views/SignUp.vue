<script setup lang="ts">
// system
import { inject } from "vue";
import { DICTIONARY_KEY } from "@shared/system/localizations";
import type { Dictionary } from "@shared/system/localizations";
import { VIEW_MODELS_KEY } from "../viewModels";
import type { ViewModels } from "../viewModels";

const t = inject(DICTIONARY_KEY) as Dictionary;
const { store, createSignUpViewModel } = inject(VIEW_MODELS_KEY) as ViewModels;
const { state, signUp, signOut } = createSignUpViewModel(store);

if (store.user !== null) {
    state.isPresentDialog = true;
}

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

  v-row(justify="center")
    v-dialog(v-model="state.isPresentDialog", persistent, max-width="290")
      v-card
        v-card-title.text-h5 Use Google's location service?
        v-card-text Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.
        v-card-actions
          v-spacer
          v-btn(color="warning", text, @click="signOut()") Sign Out
          v-btn(color="success", text, @click="state.isPresentDialog = false") Go Home
</template>
