import dependencies from "../dependencies";
import { Scene } from "@/shared/system/interfaces/scene";
import { BootScene } from "../../application/usecases/boot";
import { SignInScene } from "../../application/usecases/signIn";
import { SignOutScene } from "../../application/usecases/signOut";
import { SignUpScene } from "../../application/usecases/signUp";
import { SignInStatusContext } from "../interfaces/authenticator";
import { User } from "./user";
import { Observable } from "rxjs";


export default {
    signInStatus: (): Observable<SignInStatusContext> => {
        return dependencies.auth.signInStatus();
    }

    , authorize: <T, U extends Scene<T>>(actor: User|null, scene: U): boolean => {
        switch (scene.constructor) {
        case BootScene: {
            return true;
        }
        case SignUpScene: {
            return false;
        }
        case SignInScene: {
            return false;
        }
        case SignOutScene: {
            return false;
        }
        }
        return false;
    }
};