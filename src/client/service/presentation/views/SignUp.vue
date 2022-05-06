<script setup lang="ts">
// system
import { inject, reactive } from "vue";
import { DICTIONARY_KEY } from "@shared/system/localizations";
import type { Dictionary } from "@shared/system/localizations";
import { VIEW_MODELS_KEY } from "../viewModels";
import type { ViewModels } from "../viewModels";
import { share } from "rxjs";

const t = inject(DICTIONARY_KEY) as Dictionary;
const { shared, createSignUpViewModel } = inject(VIEW_MODELS_KEY) as ViewModels;
const { local, isPresentDialog, signUp, signOut, goHome } = createSignUpViewModel(shared);

const state = reactive<{
  isPresentDialog: boolean;
  email: string|null;
  password: string|null;
}>({
    isPresentDialog
    , email: null
    , password: null
});

</script>

<template lang="pug">
v-container
  v-app-bar(app)
    v-toolbar-title {{ t.signUp.title }}
  h1 {{ t.signUp.title }}

  v-form(ref="form", v-model="local.isValid", lazy-validation)
    v-text-field(
      v-model="state.email",
      :error-messages="local.idInvalidMessage",
      :label="t.common.labels.mailAddress",
      required
    )
    v-text-field(
      v-model="state.password",
      :error-messages="local.passwordInvalidMessage",
      :label="t.common.labels.password",
      required
    )
    v-btn.mr-4(
      :disabled="!local.isValid",
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
          v-btn(
            color="warning",
            text,
            @click="signOut().then((isSuccess: boolean) => { state.isPresentDialog = !isSuccess; })"
          ) Sign Out
          v-btn(color="success", text, @click="goHome()") Go Home
</template>
