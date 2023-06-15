
// system
import { Dictionary, DICTIONARY_KEY } from "@/shared/system/localizations";
import { inject, reactive } from "vue";
import { Performer, Dispatcher, Mutable, SharedStore, Store } from ".";
import { useRouter } from "vue-router";
import { Subscription } from "rxjs";
import { Actor } from "@/shared/service/application/actors";
import { MessageProperties } from "@/shared/service/domain/chat/message";
import { Consult, ConsultScenes, ConsultUsecase, isConsultGoal } from "@/shared/service/application/usecases/signedInUser/consult";

export interface ChatStore extends Store {
    messages: MessageProperties[]
}

export interface ChatPerformer extends Performer<ChatStore> {
    readonly store: ChatStore;
    consult: (context: ConsultScenes, actor: Actor) => void;
}

export function createChatPerformer(dispatcher: Dispatcher): ChatPerformer {
    const store = reactive<ChatStore>({
        messages: []
    });

    return {
        store
        , consult: (context: ConsultScenes, actor: Actor) => {
            // const _shared = dispatcher.stores.shared as Mutable<SharedStore>;
            let subscription: Subscription | null = null;
            subscription = new ConsultUsecase(context)
                .interactedBy(actor, {
                    next: ([lastSceneContext, performedScenario]) => {
                        if (!isConsultGoal(lastSceneContext)) { return; }
                        switch (lastSceneContext.scene) {
                        case Consult.goals.onSuccessThenServiceDisplaysMessages: {
                            console.log("OKKKKKK", lastSceneContext.messages);
                            break;
                        }
                        case Consult.goals.onFailureThenServicePresentsError: {
                            console.error(lastSceneContext.error);
                            break;
                        }
                        }
                    }
                });
        }
    };
}