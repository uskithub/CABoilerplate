<script setup lang="ts">
// system
import { inject } from "vue";
import { useRouter } from "vue-router";
import type { ViewModels } from "../viewModels";
import { VIEW_MODELS_KEY } from "../viewModels";

const { store, createSignInViewModel } = inject(VIEW_MODELS_KEY) as ViewModels;
const { state, signIn, signOut } = createSignInViewModel(store);

if (store.user !== null) {
    state.isPresentDialog = true;
}
</script>

<template lang="pug">
v-container
  v-app-bar(app)
    v-toolbar-title ホーム
  h1 SignIn
  v-form(ref="form", v-model="state.isValid", lazy-validation)
    v-text-field(
      v-model="state.email",
      :rules="emailRules",
      label="Mail Address",
      required
    )
    span(v-if="state.idInvalidMessage !== null") {{ state.idInvalidMessage }}
    v-text-field(
      v-model="state.password",
      :rules="passwordRules",
      label="Password",
      required
    )
    span(v-if="state.passwordInvalidMessage !== null") {{ state.passwordInvalidMessage }}
    v-btn.mr-4(
      :disabled="!state.isValid",
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
          v-btn(color="warning", text, @click="signOut()") Sign Out
          v-btn(color="success", text, @click="state.isPresentDialog = false") Go Home
</template>
