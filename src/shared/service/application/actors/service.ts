
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
                , startObservingUsersProjects: "サービスはユーザのプロジェクトの観測を開始する"
            }
            , goals: {
                serviceDoNothing: "サービスは何もしない"
                , onUpdateUsersProjectsThenServiceUpdateUsersProjectList: "ユーザのプロジェクトが更新された時_サービスはユーザのプロジェクト一覧を更新する"
            }
        }
    } as const;
        
}
export const isService = (actor: Actor): actor is Service => actor.constructor === Service;