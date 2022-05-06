<script setup lang="ts">
// system
import { inject, reactive } from "vue";
import { useRouter } from "vue-router";
import type { ViewModels } from "../viewModels";
import { VIEW_MODELS_KEY } from "../viewModels";

const { shared, createSignInViewModel } = inject(VIEW_MODELS_KEY) as ViewModels;
const { local, isPresentDialog, signIn, signOut, goHome } = createSignInViewModel(shared);

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
    v-toolbar-title ホーム
  h1 SignIn
  v-form(ref="form", v-model="local.isValid", lazy-validation)
    v-text-field(
      v-model="state.email",
      :error-messages="local.idInvalidMessage",
      label="Mail Address",
      required
    )
    v-text-field(
      v-model="state.password",
      :error-messages="local.passwordInvalidMessage",
      label="Password",
      required
    )
    v-btn.mr-4(
      :disabled="!local.isValid",
      color="success",
      @click="signIn(state.email, state.password)"
    ) Sign In

  router-link(to="/signup") -> SignUp

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
          v-btn(
            color="success",
            text,
            @click="() => { state.isPresentDialog = false; goHome(); }"
          ) Go Home
</template>
