export const Service = {
    observingUsersTasks : {
        basics : {
            serviceDetectsSigningIn: "サービスはユーザのサインインを検知する"
            , startObservingUsersTasks: "サービスはユーザのタスクの観測を開始する"
        }
        , goals: {
            serviceDoNothing: "サービスは何もしない"
            , onUpdateUsersTasksThenServiceUpdateUsersTaskList: "ユーザのタスクが更新された時_サービスはユーザのタスク一覧を更新する"
        }
    }
} as const;
    