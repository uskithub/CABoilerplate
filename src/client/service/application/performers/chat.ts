// service

// system
import { Dictionary, DICTIONARY_KEY } from "@/shared/system/localizations";
import { inject, reactive } from "vue";
import { Performer, Dispatcher, Mutable, SharedStore, Store } from ".";
import { useRouter } from "vue-router";
import { Subscription } from "rxjs";
import { Actor } from "@/shared/service/application/actors";
import { MessageProperties } from "@/shared/service/domain/chat/message";
import { SignInUser } from "@/shared/service/application/usecases/signedInUser";
import { Usecase } from "@/shared/service/application/usecases";

export interface ChatStore extends Store {
    messages: MessageProperties[]
}

export interface ChatPerformer extends Performer<ChatStore> {
    readonly store: ChatStore;
    consult: (usecase: Usecase<"consult">, actor: Actor) => void;
}

export function createChatPerformer(dispatcher: Dispatcher): ChatPerformer {
    const store = reactive<ChatStore>({
        messages: []
    });

    return {
        store
        , consult: (usecase: Usecase<"consult">, actor: Actor) => {
            const goals = SignInUser.consult.goals;
            // const _shared = dispatcher.stores.shared as Mutable<SharedStore>;
            let subscription: Subscription | null = null;
            subscription = usecase
                .interactedBy(actor, {
                    next: ([lastSceneContext]) => {
                        switch (lastSceneContext.scene) {
                        case goals.onSuccessThenServiceDisplaysMessages: {
                            console.log("OKKKKKK", lastSceneContext.messages);
                            break;
                        }
                        case goals.onFailureThenServicePresentsError: {
                            console.error(lastSceneContext.error);
                            break;
                        }
                        }
                    }
                });
        }
    };
}