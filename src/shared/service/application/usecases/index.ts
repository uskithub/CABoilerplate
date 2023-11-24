import { BootScenario, BootScenes } from "./nobody/boot";
import { SignInScenario, SignInScenes } from "./nobody/signIn";
import { SignUpScenario, SignUpScenes } from "./nobody/signUp";

import { SignOutScenario, SignOutScenes } from "./signedInUser/signOut";

import { ObservingUsersTasksScenario, ObservingUsersTasksScenes } from "./service/observingUsersTasks";
import { GetWarrantyListScenario, GetWarrantyListScenes } from "./signedInUser/getWarrantyList";
import { ListInsuranceItemsScenario, ListInsuranceItemsScenes } from "./ServiceInProcess/signedInUser/listInsuranceItems";
import { Usecase as _Usecase, AllUsecases, AllUsecasesOverDomain, DomainRequirements, UsecaseSelectorOverDomain } from "robustive-ts";
import { ConsultScenario, ConsultScenes } from "./signedInUser/consult";
import { ObservingUsersProjectsScenario, ObservingUsersProjectsScenes } from "./service/observingUsersProjects";
import { ObservingProjectScenario, ObservingProjectScenes } from "./signedInUser/observingProject";

const domains = ["application", "authentication", "projectManagement"] as const;
export type Domains = typeof domains[number];

export type Requirements = {
    application : {
        boot : { scenes: BootScenes; scenario: BootScenario; };
    }
    , authentication : {
        signIn : { scenes: SignInScenes; scenario: SignInScenario; };
        signUp : { scenes: SignUpScenes; scenario: SignUpScenario; };
        signOut : { scenes: SignOutScenes; scenario: SignOutScenario; };
    }
    , projectManagement : {
        /* signInUser */
        observingProject : { scenes: ObservingProjectScenes; scenario: ObservingProjectScenario; };
        listInsuranceItems : { scenes: ListInsuranceItemsScenes; scenario: ListInsuranceItemsScenario; }
        getWarrantyList : { scenes: GetWarrantyListScenes; scenario: GetWarrantyListScenario; }
        consult : { scenes: ConsultScenes; scenario: ConsultScenario; }
        /* service actor */
        observingUsersTasks : { scenes: ObservingUsersTasksScenes; scenario: ObservingUsersTasksScenario; };
        observingUsersProjects : { scenes: ObservingUsersProjectsScenes; scenario: ObservingUsersProjectsScenario; };
    }
};

const usecases = new UsecaseSelectorOverDomain<Requirements>();

export const U = {
    application : {
        boot : usecases.application.boot(BootScenario)
    }
    , authentication : {
        signIn : usecases.authentication.signIn(SignInScenario)
        , signUp : usecases.authentication.signUp(SignUpScenario)
        , signOut : usecases.authentication.signOut(SignOutScenario)
    }
    , projectManagement : {
        observingProject : usecases.projectManagement.observingProject(ObservingProjectScenario)
        , listInsuranceItems : usecases.projectManagement.listInsuranceItems(ListInsuranceItemsScenario)
        , getWarrantyList : usecases.projectManagement.getWarrantyList(GetWarrantyListScenario)
        , consult : usecases.projectManagement.consult(ConsultScenario)
        /* service actor */
        , observingUsersTasks : usecases.projectManagement.observingUsersTasks(ObservingUsersTasksScenario)
        , observingUsersProjects : usecases.projectManagement.observingUsersProjects(ObservingUsersProjectsScenario)
    }
};


export type Usecases = AllUsecasesOverDomain<Requirements>;
export type UsecasesOf<D extends keyof Requirements> = AllUsecases<Requirements, D>; 
export type Usecase<D extends keyof Requirements, U extends keyof Requirements[D]> = _Usecase<Requirements, D, U>;

export type UsecaseLog = {
    id: string;
    executing: { 
        domain: keyof Requirements;
        usecase: { [D in keyof Requirements] : { [U in keyof Requirements[D]] : U }[ keyof Requirements[D]] }[keyof Requirements]; 
    }
    startAt: Date;
};

