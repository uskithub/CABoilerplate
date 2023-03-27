<script setup lang="ts">
// service
import { SignIn } from "@usecases/nobody/signIn";
import { SignOut } from "@usecases/signedInUser/signOut";

// system
import { DICTIONARY_KEY } from "@shared/system/localizations";
import type { Dictionary } from "@shared/system/localizations";
import { computed, inject, reactive } from "vue";
import type { BehaviorController } from "../../application/behaviors";
import { BEHAVIOR_CONTROLLER_KEY } from "../../application/behaviors";
import { SignInStatus } from "@shared/service/domain/interfaces/authenticator";

const t = inject(DICTIONARY_KEY) as Dictionary;
const { stores, dispatch } = inject(BEHAVIOR_CONTROLLER_KEY) as BehaviorController;

const state = reactive<{
  email: string | null;
  password: string | null;
  isValid: boolean;
}>({
  email: null
  , password: null
  , isValid: true
});

const isPresentDialog = computed(() => stores.shared.signInStatus === SignInStatus.signIn);
// const isFormValid = computed(() => state.email !== null && state.password !== null);

</script>

<template lang="pug">
v-container
  v-app-bar(app)
    v-toolbar-title ホーム
  h1 SignIn
  v-form(ref="form", v-model="state.isValid", lazy-validation)
    span(v-if="stores.user.signInFailureMessage !== null") {{ stores.user.signInFailureMessage }}
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
      :disabled="!state.isValid",
      color="success",
      @click="dispatch({ scene: SignIn.userStartsSignInProcess, id: state.email, password: state.password })"
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
            @click="dispatch({ scene: SignOut.userStartsSignOutProcess, id: state.email, password: state.password })"
          ) Sign Out
          v-btn(
            color="success",
            text,
            @click="dispatch({ scene: SignOut.userResignSignOut })"
          ) Go Home
</template>
