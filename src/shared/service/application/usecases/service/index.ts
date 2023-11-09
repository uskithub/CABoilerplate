export const Service = {
    observingUsersTasks : {
        basics : {
            serviceDetectsSigningIn: "サービスはユーザのサインインを検知する"
            , serviceStartsObservingUsersTasks: "サービスはユーザのタスクの観測を開始する"
        }
        , goals: {
            serviceDoNothing: "サービスは何もしない"
            , onUpdateUsersTasksThenServiceUpdateUsersTaskList: "ユーザのタスクが更新された時_サービスはユーザのタスク一覧を更新する"
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
    