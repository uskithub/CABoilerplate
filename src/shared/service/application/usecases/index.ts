import { BootScenario } from "./nobody/boot";
import { SignInScenario } from "./nobody/signIn";
import { SignUpScenario } from "./nobody/signUp";

import { SignOutScenario } from "./signedInUser/signOut";

import { GetWarrantyListScenario } from "./signedInUser/getWarrantyList";
import { ObservingProjectScenario } from "./signedInUser/observingProject";
import { ObservingUsersTasksScenario } from "./service/observingUsersTasks";
import { ObservingUsersProjectsScenario } from "./service/observingUsersProjects";
import { ObservingUsersTimelineScenario } from "./service/observingUsersTimeline";
import { AllUsecases, AllUsecasesOverDomain, Robustive, Usecase as _Usecase } from "robustive-ts";

export const requirements = {
    application : {
        boot : BootScenario
    }
    , authentication : {
        signIn : SignInScenario
        , signUp : SignUpScenario
        , signOut : SignOutScenario
    }
    , timeline : {
        observingUsersTimeline : ObservingUsersTimelineScenario
    }
    , projectManagement : {
        observingProject : ObservingProjectScenario
        , getWarrantyList : GetWarrantyListScenario
        /* service actor */
        , observingUsersTasks : ObservingUsersTasksScenario
        , observingUsersProjects : ObservingUsersProjectsScenario
    }
};

export const U = new Robustive(requirements);

export type Requirements = typeof requirements;
export type DomainKeys = keyof Requirements;
export type UsecaseKeys = { [D in DomainKeys] : keyof Requirements[D]; }[DomainKeys];

export type Usecases = AllUsecasesOverDomain<Requirements>;
export type UsecasesOf<D extends keyof Requirements> = AllUsecases<Requirements, D>; 
export type Usecase<D extends keyof Requirements, U extends keyof Requirements[D]> = _Usecase<Requirements, D, U>;

export type UsecaseLog = {
    id: string;
    executing: { 
        domain: DomainKeys;
        usecase: UsecaseKeys;
    }
    startAt: Date;
};

