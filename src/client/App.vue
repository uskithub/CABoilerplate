<script setup lang="ts">
import { inject } from "vue";
import { DISPATCHER_KEY } from "./service/application/performers";
import type { Dispatcher } from "./service/application/performers";

const { stores } = inject<Dispatcher>(DISPATCHER_KEY)!;

const dump = () => {
  if ( stores && stores.shared ) {
    console.log("★★★★ stores.shared is exists", stores.shared.isLoading);
    return ;
  } else {
    console.log("★★★★ stores.shared is null")
    return true;
  }
}

</script>
<template lang="pug">
v-app(id="inspire")
  v-row(v-if="stores.shared.isLoading" align="center")
    v-col.d-flex.justify-center
        v-progress-circular(
          :size="120"
          :width="15"
          color="purple"
          indeterminate
        )
  router-view(v-else)
</template>