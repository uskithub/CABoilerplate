import { Authenticator, SignInStatus, SignInStatusContext } from "@interfaces/authenticator";
import { FirebaseApp } from "firebase/app";
import { Auth, getAuth, onAuthStateChanged, Unsubscribe } from "firebase/auth";
import { Observable, ReplaySubject } from "rxjs";
import { User } from "../domain/models/user";

export class FirebaseAuthenticator implements Authenticator {
    #auth: Auth
    #unscriber: Unsubscribe
    #signInStatus: ReplaySubject<SignInStatusContext>;

    constructor(app: FirebaseApp) {
        this.#auth = getAuth(app);
        this.#signInStatus = new ReplaySubject(1);

        this.#unscriber = onAuthStateChanged(this.#auth, (user) => {
            if (user) {
                const _user: User = {
                    uid: user.uid
                    , email: user.email
                    , photoURL: user.photoURL
                    , displayName: user.displayName
                };
                console.log("onAuthStateChanged: signIn", _user);
                this.#signInStatus.next({ kind: SignInStatus.signIn, user: _user });
            } else {
                console.log("onAuthStateChanged: signOut");
                this.#signInStatus.next({ kind: SignInStatus.signOut });
            }
        });
    }

    signInStatus(): Observable<SignInStatusContext> {
        return this.#signInStatus.asObservable();
    }
}