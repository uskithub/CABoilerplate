import { R, Usecase, UsecasesOf } from "@/shared/service/application/usecases";
import { Dispatcher, Mutable, Performer, Store } from ".";
import { Actor } from "@/shared/service/application/actors";
import { Observable, Subscription } from "rxjs";
import { reactive } from "vue";
import { Service } from "@/shared/service/application/actors/service";
import { InteractResultType } from "robustive-ts";
import { ChangedConduct, ItemChangeType } from "@/shared/service/domain/interfaces/backend";

export interface TimelineStore extends Store {
    
}

export interface TimelinePerformer extends Performer<"timeline", TimelineStore> {
    readonly store: TimelineStore;
    dispatch: (usecase: UsecasesOf<"timeline">, actor: Actor, dispatcher: Dispatcher) => Promise<Subscription | void>;
}

export function createTimelinePerformer(): TimelinePerformer {

    const store = reactive<TimelineStore>({
    });

    const _store = store as Mutable<TimelineStore>;

    const d = R.timeline;

    const observingUsersTimeline = (usecase: Usecase<"timeline", "observingUsersTimeline">, actor: Actor, dispatcher: Dispatcher): Promise<Subscription | void> => {
        const goals = d.observingUsersTimeline.keys.goals;
        return usecase
            .interactedBy(actor)
            .then(result => {
                if (result.type !== InteractResultType.success) {
                    return console.error("TODO", result);
                }

                switch (result.lastSceneContext.scene) {
                case goals.startObservingUsersTimeline: {
                    const observable = result.lastSceneContext.timelineObservable as unknown as Observable<ChangedConduct[]>;
                    const subscription = observable.subscribe({
                        next: changedConducts => {
                            changedConducts.forEach(changedConduct => {
                                switch (changedConduct.case) {
                                case ItemChangeType.added: {
                                    console.log("added", changedConduct.item);
                                    break;
                                }
                                case ItemChangeType.modified: {
                                    console.log("modified", changedConduct.item);
                                    break;
                                }
                                case ItemChangeType.removed: {
                                    console.log("removed", changedConduct.item);
                                    break;
                                }
                                }
                            });
                        }
                        , error: (e) => console.error(e)
                        , complete: () => {
                            console.info("complete");
                            subscription?.unsubscribe();
                        }
                    });

                    break;
                }
                }
            });
    };

    return {
        store
        , dispatch: (usecase: UsecasesOf<"timeline">, actor: Actor, dispatcher: Dispatcher): Promise<Subscription | void> => {
            switch (usecase.name) {
            case "observingUsersTimeline": {
                return observingUsersTimeline(usecase, actor, dispatcher);
            }
            }
        }
    };
}