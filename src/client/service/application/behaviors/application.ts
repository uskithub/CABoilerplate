// service
import { Boot, BootScenario, BootUsecase, isBootGoal, isBootScene } from "@usecases/boot";

// system
import { Dictionary, DICTIONARY_KEY } from "@/shared/system/localizations";
import { inject, reactive } from "vue";
import { Behavior, LocalStore, Mutable, SharedStore } from ".";
import { useRouter } from "vue-router";
import { Subscription } from "rxjs";
import { Nobody, UserNotAuthorizedToInteractIn } from "robustive-ts";
import { Task } from "@/shared/service/domain/models/task";
import { ItemChangeType } from "@/shared/service/domain/interfaces/backend";
import { SignInStatus } from "@/shared/service/domain/interfaces/authenticator";


export interface ApplicationBehavior extends Behavior<SharedStore> {
    readonly store: SharedStore;
    boot: (context: BootScenario) => void;
}

export function createApplicationBehavior(shared: SharedStore): ApplicationBehavior {
    const t = inject(DICTIONARY_KEY) as Dictionary;
    const router = useRouter();

    const _shared = shared as Mutable<SharedStore>;

    return {
        store: shared
        , boot: (context: BootScenario) => {
            let subscription: Subscription | null = null;
            subscription = new BootUsecase(context)
                .interactedBy(new Nobody())
                .subscribe({
                    next: (performedScenario: BootScenario[]) => {
                        // bootはタスクの監視が後ろにくっ付くので complete が呼ばれないためここで計測する
                        const executingUsecase = _shared.executingUsecase;
                        if (executingUsecase && isBootScene(executingUsecase.executing)) {
                            const elapsedTime = (new Date().getTime() - executingUsecase.startAt.getTime());
                            _shared.executingUsecase = null;
                            console.info(`The BootScenerio takes ${elapsedTime} ms.`);
                        }
                        console.log("boot:", performedScenario);
                        const lastSceneContext = performedScenario.slice(-1)[0];
                        if (!isBootGoal(lastSceneContext)) { return; }
                        switch (lastSceneContext.scene) {
                            case Boot.goals.servicePresentsHome:
                                _shared.user = { ...lastSceneContext.user };
                                _shared.signInStatus = SignInStatus.signIn;
                                console.log("hhhh", _shared.user, _store.signInStatus);
                                break;
                            case Boot.goals.sessionNotExistsThenServicePresentsSignin:
                                _store.signInStatus = SignInStatus.signOut;
                                router.replace("/signin");
                                break;
                            case Boot.goals.onUpdateUsersTasksThenServiceUpdateUsersTaskList:
                                let mutableUserTasks = _store.userTasks as Task[];
                                lastSceneContext.changedTasks.forEach(changedTask => {
                                    switch (changedTask.kind) {
                                        case ItemChangeType.added: {
                                            // hot reloadで増えてしまうので、同じものを予め削除しておく
                                            for (let i = 0, imax = mutableUserTasks.length; i < imax; i++) {
                                                if (mutableUserTasks[i].id === changedTask.id) {
                                                    mutableUserTasks.splice(i, 0);
                                                    break;
                                                }
                                            }
                                            mutableUserTasks.unshift(changedTask.item);
                                            break;
                                        }
                                        case ItemChangeType.modified: {
                                            // doingかどうかを調べ、そうなら更新する
                                            // if (self.#stores.currentUser._doingTask && self.#stores.currentUser._doingTask.id === changedTask.id) {
                                            //     self.#stores.currentUser._doingTask = changedTask.item;
                                            // }
                                            for (let i = 0, imax = mutableUserTasks.length; i < imax; i++) {
                                                if (mutableUserTasks[i].id === changedTask.id) {
                                                    mutableUserTasks.splice(i, 1, changedTask.item);
                                                    break;
                                                }
                                            }
                                            break;
                                        }
                                        case ItemChangeType.removed: {
                                            for (let i = 0, imax = mutableUserTasks.length; i < imax; i++) {
                                                if (mutableUserTasks[i].id === changedTask.id) {
                                                    mutableUserTasks.splice(i, 0);
                                                    break;
                                                }
                                            }
                                            break;
                                        }
                                    }
                                });
                                console.log("user's tasks: ", _store.userTasks);
                        }
                    }
                    , error: (e) => {
                        if (e instanceof UserNotAuthorizedToInteractIn) {
                            console.error(e);
                        } else {
                            console.error(e);
                        }
                    }
                    , complete: () => {
                        const executingUsecase = _shared.executingUsecase;
                        if (executingUsecase && executingUsecase instanceof BootUsecase) {
                            const elapsedTime = (new Date().getTime() - executingUsecase.startAt.getTime());
                            _shared.executingUsecase = null;
                            console.info(`complete - BootUsecase takes ${elapsedTime} ms`);
                        } else {
                            console.info("complete");
                        }
                        subscription?.unsubscribe();
                    }
                });
        }
    };
}