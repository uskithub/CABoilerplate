<script setup lang="ts">
import { DICTIONARY_KEY } from "@shared/system/localizations";
import type { Dictionary } from "@shared/system/localizations";
import type { Dispatcher } from "../../application/performers";
import { DISPATCHER_KEY } from "../../application/performers";
import { SignInStatus } from "@shared/service/domain/interfaces/authenticator";
import { U } from "@/shared/service/application/usecases";
import { Nobody } from "@/shared/service/application/actors/nobody";
import { AuthorizedUser } from "@/shared/service/application/actors/authorizedUser";

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
    h1.mb-5 {{  t.application.views.signIn.title }}
    v-card.mx-auto(elevation="1", max-width="500")
      v-form(ref="form", v-model="state.isValid", lazy-validation)
        v-card-text
          v-row(align="center", justify="center")
            v-col(cols="auto")
              v-btn(icon="mdi-google", size="x-large")
        v-divider
        v-card-text
          v-alert(
            v-show="stores.authentication.signInFailureMessage"
            color="error"
            variant="text"
          ) {{ stores.authentication.signInFailureMessage }}
          div.text-subtitle-2.font-weight-black.mb-1 {{ t.authentication.common.labels.mailAddress }}
          v-text-field(
            v-model="state.email",
            single-line,
            variant="outlined"
            :label="t.authentication.common.labels.mailAddress",
            :error-messages="stores.authentication.idInvalidMessage",
            required
          )
          div.text-subtitle-2.font-weight-black.mb-1 {{ t.authentication.common.labels.password }}
          v-text-field(
            v-model="state.password",
            single-line,
            variant="outlined"
            type="password",
            :label="t.authentication.common.labels.password",
            :error-messages="stores.authentication.passwordInvalidMessage",
            required
          )
          v-btn.text-none.mb-4(
            color="success"
            block,
            size="x-large",
            variant="flat"
            @click="dispatch(U.authentication.signIn.basics[Nobody.usecases.signIn.basics.userStartsSignInProcess]({ id: state.email, password: state.password }))"
          ) {{ t.application.views.signIn.buttons.signIn }}
        v-divider.mb-4
        v-card-text
          v-btn.text-none.mr-4(
            color="success",
            block,
            size="x-large",
            variant="text"
            @click="dispatch(U.authentication.signIn.alternatives[Nobody.usecases.signIn.alternatives.userTapsSignUpButton]())"
          ) {{ t.application.views.signUp.buttons.signUp }}
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
              @click="dispatch(U.authentication.signOut.basics[AuthorizedUser.usecases.signOut.basics.userStartsSignOutProcess]())"
            ) Sign Out
            v-btn(
              color="success",
              text,
              @click="dispatch(U.authentication.signOut.alternatives[AuthorizedUser.usecases.signOut.alternatives.userResignSignOut]())"
            ) Go Home
</template>
