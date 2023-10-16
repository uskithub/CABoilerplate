<script setup lang="ts">
import { provide } from "vue";
import { DISPATCHER_KEY, createDispatcher } from "@/client/service/application/performers";
import { SignInStatus } from "@/shared/service/domain/interfaces/authenticator";
import { U } from "@/shared/service/application/usecases";
import { Nobody } from "@/shared/service/application/usecases/nobody";
import { watch } from "vue";
import { Service } from "@/shared/service/application/usecases/service";
import { Subscription } from "rxjs";

const dispatcher = createDispatcher();
provide(DISPATCHER_KEY, dispatcher);

const { stores, dispatch } = dispatcher;

let subscriptions: Subscription[] = [];
watch(() => stores.shared.signInStatus, (newValue) => {
    if (newValue.case === SignInStatus.signIn) {
        const user = stores.shared.signInStatus.user;
        const ts = dispatcher.dispatch(U.observingUsersTasks.basics[Service.observingUsersTasks.basics.serviceDetectsSigningIn]({ user }));
        if (ts !== null) subscriptions.push(ts);
        const ps = dispatcher.dispatch(U.observingUsersProjects.basics[Service.observingUsersProjects.basics.serviceDetectsSigningIn]({ user }));
        if (ps !== null) subscriptions.push(ps);
    } else if (newValue.case === SignInStatus.signingOut) {
        subscriptions.forEach((s) => s.unsubscribe());
        subscriptions = [];
    }
});

if (stores.shared.signInStatus.case === SignInStatus.unknown) {
    dispatch(U.boot.basics[Nobody.boot.basics.userOpensSite]());
}
</script>

<template lang="pug">
v-app(id="inspire")
  router-view
</template>