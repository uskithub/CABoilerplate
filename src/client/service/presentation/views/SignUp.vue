<script setup lang="ts">
// service

// system
import { computed, inject, reactive } from "vue";
import { DICTIONARY_KEY } from "@shared/system/localizations";
import type { Dictionary } from "@shared/system/localizations";
import { DISPATCHER_KEY } from "../../application/performers";
import type { Dispatcher } from "../../application/performers";
import { R } from "@/shared/service/application/usecases";
import { isAuthenticatedUser } from "@/shared/service/application/actors/authenticatedUser";
import { isAuthorizedUser } from "@/shared/service/application/actors/authorizedUser";

const t = inject<Dictionary>(DICTIONARY_KEY)!;
const { stores, dispatch } = inject<Dispatcher>(DISPATCHER_KEY)!;

const state = reactive<{
    email: string | null;
    password: string | null;
}>({
    email: null
    , password: null
});

const isPresentDialog = computed(() => isAuthorizedUser(stores.shared.actor));
const isFormValid = computed(() => state.email !== null && state.password !== null);

const onClickYes = () => { 
    if (stores.authentication.domain && isAuthenticatedUser(stores.shared.actor) && stores.shared.actor.user) { 
        dispatch(R.authentication.signUp.alternatives.userSelectToBeAdministrator({ domain: stores.authentication.domain, account: stores.shared.actor.user }))
    }
}

</script>

<template lang="pug">
v-container
  v-app-bar(app)
    v-toolbar-title {{ t.application.title }}
  v-main
    h1.mb-5 {{  t.application.views.signUp.title }}
    v-card.mx-auto(
      variant="flat", 
      max-width="500"
    )
      v-form(:model-value="isFormValid", ref="form", lazy-validation)
        v-card-text
          div.text-subtitle-2.font-weight-black.mb-1 {{ t.authentication.common.labels.mailAddress }}
          v-text-field(
            v-model="state.email",
            single-line,
            variant="outlined"
            :label="t.authentication.common.labels.mailAddress",
            :error-messages="stores.authentication.idInvalidMessage",
            required
          )
          v-btn.text-none.mb-4(
            :disabled="!isFormValid",
            color="success",
            block,
            size="x-large",
            variant="flat"
            @click="dispatch(R.authentication.signUp.basics.userStartsSignUpProcess({ id: state.email, password: state.password }))"
          ) {{ t.application.views.signUp.buttons.next }}
        v-divider.mb-4
        v-card-text
          v-row(align="center", justify="center")
            v-col(cols="auto")
              v-btn(
                icon="mdi-google", 
                size="x-large",
                @click="dispatch(R.authentication.signUp.alternatives.userStartsSignUpProcessWithGoogleOAuth())"
              )
        v-divider.mb-4
        v-card-text
          v-btn.text-none.mr-4(
            color="success",
            block,
            size="x-large",
            variant="text"
            @click="dispatch(R.authentication.signUp.alternatives.userTapsSignInButton())"
          ) {{ t.application.views.signUp.buttons.signIn }}

    v-row(justify="center")
      v-dialog(v-model="isPresentDialog", persistent, max-width="290")
        v-card
          v-card-title.text-h5 Use Google's location service?
          v-card-text Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.
          v-card-actions
            v-spacer
            v-btn(
              color="warning",
              @click="dispatch(R.authentication.signOut.basics.userStartsSignOutProcess())"
            ) Sign Out
            v-btn(
              color="success",
              @click="dispatch(R.authentication.signOut.alternatives.userResignSignOut())"
            ) Go Home
      v-dialog(
        :model-value="stores.authentication.isPresentAdministratorRegistrationDialog"
        persistent, 
        max-width="700"
      )
        v-card
          v-card-title.text-h5 {{ t.authentication.admin.dialog.title }}
          v-card-text {{ t.authentication.admin.dialog.body(stores.authentication.domain ?? "") }}
          v-card-actions
            v-spacer
            v-btn(
              color="warning",
              @click="dispatch(R.authentication.signUp.alternatives.userSelectNotToBeAdministrator())"
            ) {{ t.authentication.admin.dialog.buttons.no }}
            v-btn(
              color="success",
              @click="dispatch(R.authentication.signUp.alternatives.userSelectToBeAdministrator({ domain: stores.authentication.domain, account: stores.authentication.account }))"
            ) {{ t.authentication.admin.dialog.buttons.yes }}
  v-bottom-sheet
    template(v-slot:activator="{ props }")
      v-btn(v-bind="props" text="仕様")
    v-card(
      title="仕様メモ"
    )
      v-card-text GoogleのOAuthでサインアップする場合は、ユーザのメールアドレスのドメインが未登録の場合、管理者として登録するかを確認する。
</template>
