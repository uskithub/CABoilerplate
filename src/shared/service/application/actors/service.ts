
import { BaseActor } from "robustive-ts";
import { Actor } from ".";

export class Service extends BaseActor<null> {
    static usecases = {
        observingUsersTasks : {
            basics : {
                serviceDetectsSigningIn: "サービスはユーザのサインインを検知する"
            }
            , goals: {
                serviceStartsObservingUsersTasks: "サービスはユーザのタスクの観測を開始する"
            }
        }
        , observingUsersProjects : {
            basics : {
                serviceDetectsSigningIn: "サービスはユーザのサインインを検知する"
            }
            , goals: {
                startObservingUsersProjects: "サービスはユーザのプロジェクトの観測を開始する"
            }
        }
        , observingUsersTimeline : {
            basics : {
                serviceDetectsSigningIn: "サービスはユーザのサインインを検知する"
            }
            , goals: {
                startObservingUsersTimeline: "サービスはユーザのタイムラインの観測を開始する"
            }
        }
    } as const;
        
}
export const isService = (actor: Actor): actor is Service => actor.constructor === Service;