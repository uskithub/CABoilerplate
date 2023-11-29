<script setup lang="ts">
import { DICTIONARY_KEY } from "@shared/system/localizations";
import type { Dictionary } from "@shared/system/localizations";
import type { Dispatcher } from "../../application/performers";
import { DISPATCHER_KEY } from "../../application/performers";
import { SignInStatus } from "@shared/service/domain/interfaces/authenticator";
import { U } from "@/shared/service/application/usecases";
import { Nobody } from "@/shared/service/application/actors/nobody";
import { SignedInUser } from "@/shared/service/application/actors/signedInUser";

import { computed, inject, reactive } from "vue";

const t = inject<Dictionary>(DICTIONARY_KEY)!;
const { stores, dispatch } = inject<Dispatcher>(DISPATCHER_KEY)!;

const state = reactive<{
    email: string | null;
    password: string | null;
    isValid: boolean;
}>({
    email: null
    , password: null
    , isValid: true
});

const isPresentDialog = computed(() => stores.shared.signInStatus.case === SignInStatus.signIn);
// const isFormValid = computed(() => state.email !== null && state.password !== null);

</script>

<template lang="pug">
v-container
  v-app-bar(app)
    v-toolbar-title {{ t.application.title }}
  v-main
    v-sheet(
      elevation="12"
      max-width="600"
      rounded="lg"
      width="100%"
      class="pa-4 text-center mx-auto"
    )
      h1 {{  t.application.views.signIn.title }}
      v-form(ref="form", v-model="state.isValid", lazy-validation)
        span(v-if="stores.authentication.signInFailureMessage !== null") {{ stores.authentication.signInFailureMessage }}
        v-text-field(
          v-model="state.email",
          :label="t.authentication.common.labels.mailAddress",
          :error-messages="stores.authentication.idInvalidMessage",
          required
        )
        v-text-field(
          v-model="state.password",
          type="password",
          :label="t.authentication.common.labels.password",
          :error-messages="stores.authentication.passwordInvalidMessage",
          required
        )
      .text-end
        v-btn.text-none(
          :disabled="!state.isValid",
          color="success"
          rounded
          variant="flat"
          width="90"
          @click="dispatch(U.authentication.signIn.basics[Nobody.usecases.signIn.basics.userStartsSignInProcess]({ id: state.email, password: state.password }))"
        ) {{ t.application.views.signIn.buttons.signIn }}
      br
      v-divider.mb-4
      v-btn.mr-4(
        color="success",
      ) {{ t.application.views.signUp.buttons.signUp }}
      br
      v-divider.mb-4
      br
      v-btn.mr-4(
        color="success",
      ) {{ t.application.views.signUp.buttons.signUp }}
    router-link(to="/signup") -> SignUp
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
              @click="dispatch(U.authentication.signOut.basics[SignedInUser.usecases.signOut.basics.userStartsSignOutProcess]())"
            ) Sign Out
            v-btn(
              color="success",
              text,
              @click="dispatch(U.authentication.signOut.alternatives[SignedInUser.usecases.signOut.alternatives.userResignSignOut]())"
            ) Go Home
</template>
