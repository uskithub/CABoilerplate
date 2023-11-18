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

export interface ProjectManagementStore extends Store {
    dummy: string
}

export interface ProjectManagementPerformer extends Performer<ProjectManagementStore> {
    readonly store: ProjectManagementStore;
    observingProject: (usecase: Usecase<"consult">, actor: Actor) => Promise<void>;
}

export function createProjectManagementPerformer(dispatcher: Dispatcher): ProjectManagementPerformer {
    const store = reactive<ProjectManagementStore>({
        dummy: ""
    });

    return {
        store
        // TODO ここの実装から
        , observingProject: (usecase: Usecase<"observingProject">, actor: Actor) : Promise<void> => {
            const goals = SignedInUser.usecases.observingProject.goals;
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