// service
import { Boot, BootScene } from '@usecases/boot';
import type { BootContext } from '@usecases/boot';

// system
import { Usecase } from '@/system/interfaces/usecase';
import { Router, useRouter } from 'vue-router'
import { Subscription } from 'rxjs';


export default class CommonController {
    #router: Router

    constructor() {
        this.#router = useRouter();
    }

    boot() {
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
                            this.#router.replace("/signin");
                            break;
                    }
                }
                , error: (e) => console.error(e)
                , complete: () => {
                    console.info('complete')
                    subscription?.unsubscribe();
                }
            });
    }
}