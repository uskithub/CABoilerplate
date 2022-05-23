<script setup lang="ts">
// service
import { SignUp } from "@/shared/service/application/usecases/signUp";
import type { SignUpScenario } from "@/shared/service/application/usecases/signUp";
import { SignOut } from "@/shared/service/application/usecases/signOut";
import type { SignOutScenario } from "@/shared/service/application/usecases/signOut";

// system
import { computed, inject, reactive } from "vue";
import { DICTIONARY_KEY } from "@shared/system/localizations";
import type { Dictionary } from "@shared/system/localizations";
import { VIEW_MODELS_KEY } from "../models";
import type { ViewModels } from "../models";

const t = inject(DICTIONARY_KEY) as Dictionary;
const { shared, user, dispatch } = inject(VIEW_MODELS_KEY) as ViewModels;

const state = reactive<{
  email: string|null;
  password: string|null;
}>({
    email: null
    , password: null
});

const isPresentDialog = computed(() => shared.user !== null);
const isFormValid = computed(() => state.email !== null && state.password !== null);

</script>

<template lang="pug">
v-container
  v-app-bar(app)
    v-toolbar-title {{ t.signUp.title }}
  h1 {{ t.signUp.title }}

  v-form(ref="form", v-model="isFormValid", lazy-validation)
    v-text-field(
      v-model="state.email",
      :label="t.common.labels.mailAddress",
      :error-messages="user.store.idInvalidMessage",
      required
    )
    v-text-field(
      v-model="state.password",
      type="password",
      :label="t.common.labels.password",
      :error-messages="user.store.passwordInvalidMessage",
      required
    )
    v-btn.mr-4(
      :disabled="!isFormValid",
      color="success",
      @click="dispatch({ scene: SignUp.userStartsSignUpProcess, id: state.email, password: state.password })"
    ) {{ t.signUp.buttons.signUp }}

  v-row(justify="center")
    v-dialog(v-model="isPresentDialog", persistent, max-width="290")
      v-card
        v-card-title.text-h5 Use Google's location service?
        v-card-text Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.
        v-card-actions
          v-spacer
          v-btn(
            color="warning",
            text,
            @click="dispatch({ scene: SignOut.userStartsSignOutProcess, id: state.email, password: state.password })"
          ) Sign Out
          v-btn(
            color="success",
            text,
            @click="dispatch({ scene: SignOut.userResignSignOut })"
          ) Go Home
</template>
