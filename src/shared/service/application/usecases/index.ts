import { BootScenario } from "./nobody/boot";
import { SignInScenario } from "./nobody/signIn";
import { SignUpScenario } from "./nobody/signUp";

import { SignOutScenario } from "./signedInUser/signOut";

import { ObservingUsersTasksScenario } from "./service/observingUsersTasks";

export type Usecases = 
    /* Nobody */
    { executing : BootScenario, startAt: Date }
    | { executing : SignUpScenario, startAt: Date }
    | { executing : SignInScenario, startAt: Date }

    /* SignedIn */
    | { executing : SignOutScenario, startAt: Date }

    /* Service */
    | { executing : ObservingUsersTasksScenario, startAt: Date }
;
