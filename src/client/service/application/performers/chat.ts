// service
import { ConsultScenario, ConsultScenes } from "@/shared/service/application/usecases/signedInUser/consult";

// system
import { Dictionary, DICTIONARY_KEY } from "@/shared/system/localizations";
import { inject, reactive } from "vue";
import { Performer, Dispatcher, Mutable, SharedStore, Store } from ".";
import { useRouter } from "vue-router";
import { Subscription } from "rxjs";
import { Actor } from "@/shared/service/application/actors";
import { MessageProperties } from "@/shared/service/domain/chat/message";
import { SignInUserUsecases } from "@/shared/service/application/usecases/signedInUser";
import { Scene } from "robustive-ts";

export interface ChatStore extends Store {
    messages: MessageProperties[]
}

export interface ChatPerformer extends Performer<ChatStore> {
    readonly store: ChatStore;
    consult: (context: Scene<ConsultScenes, ConsultScenario>, actor: Actor) => void;
}

export function createChatPerformer(dispatcher: Dispatcher): ChatPerformer {
    const store = reactive<ChatStore>({
        messages: []
    });

    return {
        store
        , consult: (from: Scene<ConsultScenes, ConsultScenario>, actor: Actor) => {
            const _u = SignInUserUsecases.consult;
            // const _shared = dispatcher.stores.shared as Mutable<SharedStore>;
            let subscription: Subscription | null = null;
            subscription = from
                .interactedBy(actor, {
                    next: ([lastSceneContext]) => {
                        switch (lastSceneContext.scene) {
                        case _u.goals.onSuccessThenServiceDisplaysMessages: {
                            console.log("OKKKKKK", lastSceneContext.messages);
                            break;
                        }
                        case _u.goals.onFailureThenServicePresentsError: {
                            console.error(lastSceneContext.error);
                            break;
                        }
                        }
                    }
                });
        }
    };
}