<script setup lang="ts">
// service
import { Boot } from "@/shared/service/application/usecases/boot";
import type { BootScenario } from "@/shared/service/application/usecases/boot";
// system
import { inject, reactive } from "vue";
import type { ViewModels } from "../models";
import { VIEW_MODELS_KEY } from "../models";
import { SignInStatus } from "@/shared/service/domain/interfaces/authenticator";

const { shared, user, dispatch } = inject(VIEW_MODELS_KEY) as ViewModels;

// const state = reactive<{
//     signInStatus: SignInStatus|null;
// }>({
//     signInStatus: null
// });

if (user.store.signInStatus === null && shared.user === null) {
    dispatch({ scene: Boot.userOpensSite } as BootScenario);
}

</script>

<template lang="pug">
v-container
  div [{{ user.store.signInStatus }}]
  div [{{ shared.user?.mailAddress }}]
  template(v-if="user.store.signInStatus === null")
    v-progress-circular(:size="70", :width="7", color="purple", indeterminate)
  template(v-else-if="user.store.signInStatus === SignInStatus.signOut")
    h1 Home {{ shared.user?.mailAddress }}
    ul
      li
        router-link(to="/signin") -> SignIn
      li
        router-link(to="/signup") -> SignUp
  template(v-else)
    ul
      li(v-for="task in user.store.userTasks", :key="task.id")
        | {{ task.title }}
</template>
