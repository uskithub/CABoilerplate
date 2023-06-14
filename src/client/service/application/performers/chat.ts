
// system
import { Dictionary, DICTIONARY_KEY } from "@/shared/system/localizations";
import { inject, reactive } from "vue";
import { Performer, Dispatcher, Mutable, SharedStore, Store } from ".";
import { useRouter } from "vue-router";
import { Subscription } from "rxjs";
import { Actor } from "@/shared/service/application/actors";
import { MessageProperties } from "@/shared/service/domain/chat/message";

export interface ChatStore extends Store {
    messages: MessageProperties[]
}

export interface ChatPerformer extends Performer<ChatStore> {
    readonly store: ChatStore;
    ask: (messages: MessageProperties[], actor: Actor) => void;
}

export function createChatPerformer(dispatcher: Dispatcher): ChatPerformer {
    const store = reactive<ChatStore>({
        messages: []
    });

    const _store = store as Mutable<ChatStore>;

    return {
        store
        , ask: (messages: MessageProperties[], actor: Actor) => {
            const _shared = dispatcher.stores.shared as Mutable<SharedStore>;
            let subscription: Subscription | null = null;
            subscription = new ListInsuranceItemsUsecase(context)
                .interactedBy(actor, {
                    next: ([lastSceneContext, performedScenario]) => {
                        if (!isListInsuranceItemsGoal(lastSceneContext)) { return; }
                        switch (lastSceneContext.scene) {
                        case ListInsuranceItems.goals.resultIsOneOrMoreThenServiceDisplaysResultOnInsuranceItemListView:
                            console.log("OKKKKKK", lastSceneContext.insuranceItems);
                            _store.insuranceItems = lastSceneContext.insuranceItems;
                            break;
                        case ListInsuranceItems.goals.resultIsZeroThenServiceDisplaysNoResultOnInsuranceItemListView:
                            _store.insuranceItems = null;
                            break;
                        }
                    }
                    , complete: dispatcher.commonCompletionProcess
                });
        }
    };
}