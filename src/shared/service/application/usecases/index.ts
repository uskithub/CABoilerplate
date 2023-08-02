import { BootScenario, BootScenes } from "./nobody/boot";
import { SignInScenario, SignInScenes } from "./nobody/signIn";
import { SignUpScenario, SignUpScenes } from "./nobody/signUp";

import { SignOutScenario, SignOutScenes } from "./signedInUser/signOut";

import { ObservingUsersTasksScenario, ObservingUsersTasksScenes } from "./service/observingUsersTasks";
import { GetWarrantyListScenario, GetWarrantyListScenes } from "./signedInUser/getWarrantyList";
import { ListInsuranceItemsScenario, ListInsuranceItemsScenes } from "./ServiceInProcess/signedInUser/listInsuranceItems";
import { BaseScenario, Context, MutableContext, Scenes, UsecaseSelector } from "robustive-ts";
import { ConsultScenario, ConsultScenes } from "./signedInUser/consult";
import { IActor } from "robustive-ts/types/actor";
import { Observable } from "rxjs";
import { Actor } from "../actors";

// export type Usecases = 
//     /* ServiceInProcess */
//     | { executing : ListInsuranceItemsScenario, startAt: Date }

//     /* Nobody */
//     | { executing : BootScenario, startAt: Date }
//     | { executing : SignUpScenario, startAt: Date }
//     | { executing : SignInScenario, startAt: Date }

//     /* SignedIn */
//     | { executing : SignOutScenario, startAt: Date }
//     | { executing : GetWarrantyListScenario, startAt: Date }

//     /* Service */
//     | { executing : ObservingUsersTasksScenario, startAt: Date }
// ;

export type UsecaseDefinitions = {
    /* nobody */
    boot : { scenes: BootScenes; scenario: BootScenario; };
    signIn : { scenes: SignInScenes; scenario: SignInScenario; };
    signUp : { scenes: SignUpScenes; scenario: SignUpScenario; };
    signOut : { scenes: SignOutScenes; scenario: SignOutScenario; };
    /* signInUser */
    listInsuranceItems : { scenes: ListInsuranceItemsScenes; scenario: ListInsuranceItemsScenario; }
    getWarrantyList : { scenes: GetWarrantyListScenes; scenario: GetWarrantyListScenario; }
    consult : { scenes: ConsultScenes; scenario: ConsultScenario; }
    /* service actor */
    observingUsersTasks : { scenes: ObservingUsersTasksScenes; scenario: ObservingUsersTasksScenario; };
};

const usecases = new UsecaseSelector<UsecaseDefinitions>();

export const U = {
    /* nobody */
    boot : usecases.boot(BootScenario)
    , signIn : usecases.signIn(SignInScenario)
    , signUp : usecases.signUp(SignUpScenario)
    , signOut : usecases.signOut(SignOutScenario)
    /* signInUser */
    , listInsuranceItems : usecases.listInsuranceItems(ListInsuranceItemsScenario)
    , getWarrantyList : usecases.getWarrantyList(GetWarrantyListScenario)
    , consult : usecases.consult(ConsultScenario)
    /* service actor */
    , observingUsersTasks : usecases.observingUsersTasks(ObservingUsersTasksScenario)
};