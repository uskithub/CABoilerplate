import { Authenticator, SignInStatus, SignInStatusContext } from "@interfaces/authenticator";
import { Observable, ReplaySubject } from "rxjs";
import api, { ApiInstance } from "@sh/service/infrastructure/api/$api";
import aspida from "@aspida/axios";
import { AxiosRequestConfig } from "axios";
import { User } from "@/shared/service/domain/models/user";

export class ApiAuthenticator implements Authenticator {
    // #auth: Auth
    // #unscriber: Unsubscribe
    #signInStatus: ReplaySubject<SignInStatusContext>;

    constructor() {
        this.#signInStatus = new ReplaySubject(1);
    }

    signInStatus(): Observable<SignInStatusContext> {
        const client = api(aspida());
        client.v1.users
            .$get()
            .then(user => {
                const _user: User = {
                    uid: user.uid
                    , email: user.email
                    , photoURL: user.photoURL
                    , displayName: user.displayName
                };
                this.#signInStatus.next({ kind: SignInStatus.signIn, user: _user });
            });

        return this.#signInStatus.asObservable();
    }
}