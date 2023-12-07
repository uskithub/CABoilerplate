import { Authenticator, SignInStatus, SignInStatuses } from "@interfaces/authenticator";
import { FirebaseApp, FirebaseError } from "firebase/app";
import { Auth, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, Unsubscribe, signInWithEmailAndPassword, signOut, signInWithRedirect, GoogleAuthProvider } from "firebase/auth";
import { Observable, ReplaySubject } from "rxjs";
import { UserProperties } from "@/shared/service/domain/authentication/user";

export class FirebaseAuthenticator implements Authenticator {
    #auth: Auth;
    #unscriber: Unsubscribe;
    #signInStatus: ReplaySubject<SignInStatus>;

    constructor(app: FirebaseApp) {
        this.#auth = getAuth(app);
        this.#signInStatus = new ReplaySubject(1);

        this.#unscriber = onAuthStateChanged(this.#auth, (user) => {
            if (user) {
                const _user: UserProperties = {
                    uid: user.uid
                    , mailAddress: user.email
                    , photoUrl: user.photoURL
                    , displayName: user.displayName
                    , isMailAddressVerified: user.emailVerified
                };
                console.log("onAuthStateChanged: signIn", _user);
                this.#signInStatus.next(SignInStatuses.signIn({ user : _user }));
            } else {
                console.log("onAuthStateChanged: signOut");
                this.#signInStatus.next(SignInStatuses.signOut());
            }
        });
    }

    signInStatus(): Observable<SignInStatus> {
        return this.#signInStatus.asObservable();
    }

    createAccount(mailAddress: string, password: string): Observable<UserProperties> {
        return new Observable(subscriber => {
            createUserWithEmailAndPassword(this.#auth, mailAddress, password)
                .then(userCredential => {
                    const user = userCredential.user;
                    subscriber.next({
                        uid: user.uid
                        , mailAddress: user.email
                        , photoUrl: user.photoURL
                        , displayName: user.displayName
                        , isMailAddressVerified: user.emailVerified
                    } as UserProperties);
                    subscriber.complete();
                })
                .catch(error => {
                    subscriber.error(error);
                });
        });
    }

    signIn(mailAddress: string, password: string): Observable<UserProperties> {
        return new Observable(subscriber => {
            signInWithEmailAndPassword(this.#auth, mailAddress, password)
                .then(userCredential => {
                    const user = userCredential.user;
                    subscriber.next({
                        uid: user.uid
                        , mailAddress: user.email
                        , photoUrl: user.photoURL
                        , displayName: user.displayName
                        , isMailAddressVerified: user.emailVerified
                    } as UserProperties);
                    subscriber.complete();
                })
                .catch((error: FirebaseError) => {
                    switch (error.code) {
                    // case "auth/user-not-found": {
                    //     // TODO: SystemErrorに変換する
                    //     subscriber.error(error);
                    //     return;
                    // }
                    // case "auth/wrong-password": {
                    //     // TODO: SystemErrorに変換する
                    //     subscriber.error(error);
                    //     return;
                    // }
                    // case "auth/too-many-requests": {
                    //     // TODO: SystemErrorに変換する
                    //     subscriber.error(error);
                    //     return;
                    // }
                    default: {
                        console.error(`ロジック未登録の FirebaseAuthentication エラー。以下のcodeを fireabaseAuthenticatorのsignInメソッド内、catch句の switch文に追加すること（code: ${ error.code }）`);
                        // console.log("EEE customData:", error.customData);
                        // console.log("EEE message:", error.message);
                        // console.log("EEE name:", error.name);
                        // console.log("EEE stack:", error.stack);
                        subscriber.error(error);
                        break;
                    }
                    }
                });
        });
    }

    signOut(): Observable<void> {
        return new Observable(subscriber => {
            signOut(this.#auth)
                .then(() => {
                    subscriber.next();
                    subscriber.complete();
                })
                .catch(error => {
                    subscriber.error(error);
                });
        });
    }

    oauthToGoogle(): Observable<void> {
        return new Observable(subscriber => {
            const provider = new GoogleAuthProvider();
            signInWithRedirect(this.#auth, provider)
                .then(() => {
                    subscriber.next();
                    subscriber.complete();
                })
                .catch(error => {
                    subscriber.error(error);
                });
        });
    }
}