<script setup lang="ts">
// service

// system
import { computed, inject, reactive } from "vue";
import { DICTIONARY_KEY } from "@shared/system/localizations";
import type { Dictionary } from "@shared/system/localizations";
import { DISPATCHER_KEY } from "../../application/performers";
import type { Dispatcher } from "../../application/performers";
import { isSignedInUser } from "@shared/service/application/actors/signedInUser";
import { U } from "@/shared/service/application/usecases";
import { SignInUserUsecases } from "@/shared/service/application/usecases/signedInUser";
import { NobodyUsecases } from "@/shared/service/application/usecases/nobody";

const t = inject(DICTIONARY_KEY) as Dictionary;
const { stores, dispatch } = inject(DISPATCHER_KEY) as Dispatcher;

const state = reactive<{
    email: string | null;
    password: string | null;
}>({
    email: null
    , password: null
});

const isPresentDialog = computed(() => isSignedInUser(stores.shared.actor));
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
      :error-messages="stores.user.idInvalidMessage",
      required
    )
    v-text-field(
      v-model="state.password",
      type="password",
      :label="t.common.labels.password",
      :error-messages="stores.user.passwordInvalidMessage",
      required
    )
    v-btn.mr-4(
      :disabled="!isFormValid",
      color="success",
      @click="dispatch(U.signUp.basics[NobodyUsecases.signUp.basics.userStartsSignUpProcess]({ id: state.email, password: state.password }))"
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
            @click="dispatch(U.signOut.basics[SignInUserUsecases.signOut.basics.userStartsSignOutProcess]())"
          ) Sign Out
          v-btn(
            color="success",
            text,
            @click="dispatch(U.signOut.alternatives[SignInUserUsecases.signOut.alternatives.userResignSignOut]())"
          ) Go Home
</template>
