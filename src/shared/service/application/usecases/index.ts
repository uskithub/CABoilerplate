import { BootScenario } from "./boot";
import { SignInScenario } from "./signIn";
import { SignUpScenario } from "./signUp";

import { SignOutScenario } from "./signOut";

import { GetWarrantyListScenario } from "./getWarrantyList";
import { ObservingProjectScenario } from "./observingProject";
import { ObservingUsersTasksScenario } from "./observingUsersTasks";
import { ObservingUsersProjectsScenario } from "./observingUsersProjects";
import { ObservingUsersTimelineScenario } from "./observingUsersTimeline";
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

export const R = new Robustive(requirements);

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

