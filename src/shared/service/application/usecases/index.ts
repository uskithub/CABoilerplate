import { BootScenario } from "./nobody/boot";
import { SignInScenario } from "./nobody/signIn";
import { SignUpScenario } from "./nobody/signUp";

import { SignOutScenario } from "./signedInUser/signOut";

import { GetWarrantyListScenario } from "./signedInUser/getWarrantyList";
import { ListInsuranceItemsScenario } from "./ServiceInProcess/signedInUser/listInsuranceItems";
import { ConsultScenario } from "./signedInUser/consult";
import { ObservingProjectScenario } from "./signedInUser/observingProject";
import { ObservingUsersTasksScenario } from "./service/observingUsersTasks";
import { ObservingUsersProjectsScenario } from "./service/observingUsersProjects";
import { Usecase as _Usecase, AllUsecases, AllUsecasesOverDomain, UsecaseSelectorOverDomain } from "robustive-ts";

const domains = ["application", "authentication", "projectManagement"] as const;
export type Domains = typeof domains[number];

export type Requirements = {
    application : {
        boot : BootScenario;
    }
    , authentication : {
        signIn : SignInScenario;
        signUp : SignUpScenario;
        signOut : SignOutScenario;
    }
    , projectManagement : {
        /* signInUser */
        observingProject : ObservingProjectScenario;
        listInsuranceItems : ListInsuranceItemsScenario;
        getWarrantyList : GetWarrantyListScenario;
        consult : ConsultScenario;
        /* service actor */
        observingUsersTasks : ObservingUsersTasksScenario;
        observingUsersProjects : ObservingUsersProjectsScenario;
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

