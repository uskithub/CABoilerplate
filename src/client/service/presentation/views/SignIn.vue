<script setup lang="ts">
// service

// system
import { DICTIONARY_KEY } from "@shared/system/localizations";
import type { Dictionary } from "@shared/system/localizations";
import { computed, inject, reactive } from "vue";
import type { Dispatcher } from "../../application/performers";
import { DISPATCHER_KEY } from "../../application/performers";
import { SignInStatus } from "@shared/service/domain/interfaces/authenticator";
import { U } from "@/shared/service/application/usecases";
import { Nobody } from "@/shared/service/application/actors/nobody";
import { SignedInUser } from "@/shared/service/application/actors/signedInUser";

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
    v-toolbar-title ホーム
  h1 SignIn
  v-form(ref="form", v-model="state.isValid", lazy-validation)
    span(v-if="stores.authentication.signInFailureMessage !== null") {{ stores.authentication.signInFailureMessage }}
    v-text-field(
      v-model="state.email",
      :label="t.common.labels.mailAddress",
      :error-messages="stores.authentication.idInvalidMessage",
      required
    )
    v-text-field(
      v-model="state.password",
      type="password",
      :label="t.common.labels.password",
      :error-messages="stores.authentication.passwordInvalidMessage",
      required
    )
    v-btn.mr-4(
      :disabled="!state.isValid",
      color="success",
      @click="dispatch(U.signIn.basics[Nobody.usecases.signIn.basics.userStartsSignInProcess]({ id: state.email, password: state.password }))"
    ) Sign In

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
            @click="dispatch(U.signOut.basics[SignedInUser.usecases.signOut.basics.userStartsSignOutProcess]())"
          ) Sign Out
          v-btn(
            color="success",
            text,
            @click="dispatch(U.signOut.alternatives[SignedInUser.usecases.signOut.alternatives.userResignSignOut]())"
          ) Go Home
</template>
