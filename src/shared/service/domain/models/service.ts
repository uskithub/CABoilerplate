import dependencies from "../dependencies";
import { Usecase } from "@/shared/system/interfaces/usecase";
import { BootUsecase } from "../../application/usecases/boot";
import { SignInUsecase } from "../../application/usecases/signIn";
import { SignOutUsecase } from "../../application/usecases/signOut";
import { SignUpUsecase } from "../../application/usecases/signUp";
import { SignInStatusContext } from "../interfaces/authenticator";
import { User } from "./user";
import { Observable } from "rxjs";


export default {
    signInStatus: (): Observable<SignInStatusContext> => {
        return dependencies.auth.signInStatus();
    }

    , authorize: <T, U extends Usecase<T>>(actor: User|null, initialScene: U): boolean => {
        switch (initialScene.constructor) {
        case BootUsecase: {
            return true;
        }
        case SignUpUsecase: {
            return actor === null;
        }
        case SignInUsecase: {
            return false;
        }
        case SignOutUsecase: {
            return false;
        }
        }
        return false;
    }
};