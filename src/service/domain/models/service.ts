import { Observable } from "rxjs";
import dependencies from "../dependencies";
import { SignInStatusContext } from "../interfaces/authenticator";


export default {
    signInStatus: (): Observable<SignInStatusContext> => {
        return dependencies.auth.signInStatus();
    }
}