import { BootScenario } from "./nobody/boot";
import { SignInScenario } from "./nobody/signIn";
import { SignUpScenario } from "./nobody/signUp";

import { SignOutScenario } from "./signedInUser/signOut";

import { ObservingUsersTasksScenario } from "./service/observingUsersTasks";
import { GetWarrantyListScenario } from "./signedInUser/getWarrantyList";
import { ListInsuranceItemsScenario } from "./ServiceInProcess/signedInUser/listInsuranceItems";

export type Usecases = 
    /* ServiceInProcess */
    | { executing : ListInsuranceItemsScenario, startAt: Date }

    /* Nobody */
    | { executing : BootScenario, startAt: Date }
    | { executing : SignUpScenario, startAt: Date }
    | { executing : SignInScenario, startAt: Date }

    /* SignedIn */
    | { executing : SignOutScenario, startAt: Date }
    | { executing : GetWarrantyListScenario, startAt: Date }

    /* Service */
    | { executing : ObservingUsersTasksScenario, startAt: Date }
;
