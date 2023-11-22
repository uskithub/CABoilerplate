// service

// system
import { Dictionary, DICTIONARY_KEY } from "@/shared/system/localizations";
import { inject, reactive } from "vue";
import { Performer, Dispatcher, Mutable, SharedStore, Store } from ".";
import { useRouter } from "vue-router";
import { Subscription } from "rxjs";
import { Actor } from "@/shared/service/application/actors";
import { MessageProperties } from "@/shared/service/domain/chat/message";
import { SignedInUser } from "@/shared/service/application/actors/signedInUser";
import { Usecase } from "@/shared/service/application/usecases";
import { InteractResultType } from "robustive-ts";

export interface ChatStore extends Store {
    messages: MessageProperties[]
}

export interface ChatPerformer extends Performer<ChatStore> {
    readonly store: ChatStore;
    consult: (usecase: Usecase<"projectManagement", "consult">, actor: Actor) => Promise<void>;
}

export function createChatPerformer(dispatcher: Dispatcher): ChatPerformer {
    const store = reactive<ChatStore>({
        messages: []
    });

    return {
        store
        , consult: (usecase: Usecase<"projectManagement", "consult">, actor: Actor) : Promise<void> => {
            const goals = SignedInUser.usecases.consult.goals;
            // const _shared = dispatcher.stores.shared as Mutable<SharedStore>;
            return usecase
                .interactedBy(actor)
                .then(result => {
                    if (result.type !== InteractResultType.success) { return; }
                    const context = result.lastSceneContext;
                    switch (context.scene) {
                    case goals.onSuccessThenServiceDisplaysMessages: {
                        console.log("OKKKKKK", context.messages);
                        break;
                    }
                    case goals.onFailureThenServicePresentsError: {
                        console.error(context.error);
                        break;
                    }
                    }
                });
        }
    };
}