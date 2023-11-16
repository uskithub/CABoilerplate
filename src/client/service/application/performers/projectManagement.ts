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

export interface ProjectManagementStore extends Store {
    dummy: string
}

export interface ProjectManagementPerformer extends Performer<ProjectManagementStore> {
    readonly store: ProjectManagementStore;
    consult: (usecase: Usecase<"consult">, actor: Actor) => void;
}

export function createProjectManagementPerformer(dispatcher: Dispatcher): ProjectManagementPerformer {
    const store = reactive<ProjectManagementStore>({
        dummy: ""
    });

    return {
        store
        // TODO ここの実装から
        , observingProject: (usecase: Usecase<"observingProject">, actor: Actor) => {
            const goals = SignedInUser.usecases.observingProject.goals;
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
                    , complete: () => dispatcher.commonCompletionProcess(subscription)
                });
        }
    };
}