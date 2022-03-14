import { Observable } from "rxjs";
import { Usecases } from "../../application/usecases";
import dependencies from "../dependencies";
import { SignInStatusContext } from "../interfaces/authenticator";
import { User } from "./user";


export default {
    signInStatus: (): Observable<SignInStatusContext> => {
        return dependencies.auth.signInStatus();
    }

    , authorize: (usecase: Usecases, actor: User|null): boolean => {
        switch (usecase) {
        case Usecases.boot: { return true; }
        case Usecases.signIn: { return actor === null; }
        case Usecases.signUp: { return actor === null; }
        case Usecases.singOut: { return !!actor; }
        }
        return true;
    }
};