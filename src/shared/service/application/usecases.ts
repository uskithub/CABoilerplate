import { BootScenario } from "./usecases/boot";
import { SignInScenario } from "./usecases/signIn";
import { SignOutScenario } from "./usecases/signOut";
import { SignUpScenario } from "./usecases/signUp";

export type Usecases = { executing : BootScenario, startAt: Date }
    | { executing : SignUpScenario, startAt: Date }
    | { executing : SignInScenario, startAt: Date }
    | { executing : SignOutScenario, startAt: Date }
;
