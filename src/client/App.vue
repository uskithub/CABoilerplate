<script setup lang="ts">
import { inject } from "vue";
import { SERVICE_KEY } from "./service/application/performers";
import type { Service } from "./service/application/performers";

const { stores } = inject<Service>(SERVICE_KEY)!;

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