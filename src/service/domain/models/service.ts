import { Observable } from "rxjs";
import dependencies from "../dependencies";
import { SignInStatusContext } from "../interfaces/authenticator";


export default {
    observeSignInStatus: (): Observable<SignInStatusContext> => {
        return dependencies.auth.observeSignInStatus();
    }
}