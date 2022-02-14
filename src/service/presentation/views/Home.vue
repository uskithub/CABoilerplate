<script setup lang="ts">

import { Usecase } from '@/system/interfaces/usecase';
import { Boot, BootScene } from '@usecases/boot';
import type { BootContext } from '@usecases/boot';
import { Subscription } from 'rxjs';

import { useRouter } from 'vue-router'

const router = useRouter();

const boot = () => {
    let subscription: Subscription|null = null;
    subscription = Usecase
        .interact<BootContext, BootScene>(new BootScene())
        .subscribe({
            next: (performedSenario) => {
                const lastContext = performedSenario.slice(-1)[0];
                switch(lastContext.scene){
                    case Boot.sessionExistsThenPresentHome:
                        break;
                    case Boot.sessionNotExistsThenPreesntSignin:
                        router.replace("/signin");
                        break;
                }
            }
            , error: (e) => console.error(e)
            , complete: () => {
                console.info('complete')
                subscription?.unsubscribe();
            }
        });
};

boot();

</script>

<template lang="pug">
v-container
  h1 Home
  router-link(to="/signin") -> Signin
</template>
