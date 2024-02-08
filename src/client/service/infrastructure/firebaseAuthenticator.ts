import { Authenticator, SignInStatus, SignInStatuses } from "@interfaces/authenticator";
import { FirebaseApp, FirebaseError } from "firebase/app";
import { Auth, connectAuthEmulator, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, Unsubscribe, signInWithEmailAndPassword, signOut, signInWithRedirect, GoogleAuthProvider, getRedirectResult } from "firebase/auth";
import { Observable, ReplaySubject } from "rxjs";
import { UserCredential, Account } from "@/shared/service/domain/authentication/user";

export class FirebaseAuthenticator implements Authenticator {
    #auth: Auth;
    #unscriber: Unsubscribe;
    #signInStatus: ReplaySubject<SignInStatus>;

    constructor(app: FirebaseApp, isUsingEmulator: boolean = false) {
        if (isUsingEmulator) {
            const auth = getAuth();
            connectAuthEmulator(auth, "http://127.0.0.1:9099");
            this.#auth = auth;
        } else {
            this.#auth = getAuth(app);
        }
        this.#signInStatus = new ReplaySubject(1);

        this.#unscriber = onAuthStateChanged(this.#auth, (user) => {
            /**
             * UserInfo : {
             *     "uid": "hGrEoUjY0CNJzFsy9qL5hcQyR5l1",
             *     "email": "yusuke.saito@jibunstyle.com",
             *     "emailVerified": true,
             *     "displayName": "斉藤祐輔",
             *     "isAnonymous": false,
             *     "photoURL": "https://lh3.googleusercontent.com/a/ACg8ocIUXRt3taSnafGVRLtluwbtjlJv300-mjl5KNioHGIZJ2Y=s96-c",
             *     "providerData": [
             *         {
             *             "providerId": "google.com",
             *             "uid": "107543062226732076124",
             *             "displayName": "斉藤祐輔",
             *             "email": "yusuke.saito@jibunstyle.com",
             *             "phoneNumber": null,
             *             "photoURL": "https://lh3.googleusercontent.com/a/ACg8ocIUXRt3taSnafGVRLtluwbtjlJv300-mjl5KNioHGIZJ2Y=s96-c"
             *         }
             *     ],
             *     "stsTokenManager": {
             *         "refreshToken": "AMf-vBypw6_RucsOsYgiG0oYlOtISoF3bH0nQFvSlU21SahKXnaId44sjSfm95tWbG5cBIzLFhxxna_FrU3WzozHfwc_VyhpOSDOJlzNe5JYjT6MTwDCfOJgP7D_4oxpYTHCJyC7d2Z0h5uyVIDDvgUpYL_IQp1K6XKrwGSYHh0NrU_nYxYlianINLAsApW9y8VjGIdOaCQRsWSlL2Xtbw3ivLb_Rz0TkP_7jcB9i_pVw7XAprjcUm1XJfZd_DwSsuCyspc96L-RePPGURs3pBjqkNH_tjBe-IglobZ_gMxRSCIyTxnrTznSH_vTYnO-jovRv57bbJqNHiuHFL7vLDxVCK9n-SXoXkVaYofim9GBW3OMuVlm-UKsZVJZzVcCp_EJH6ya4KIjWx6ivx3GRAdAsHXvHovXIGHbdLm1g77x9eYA7RB-MYY",
             *         "accessToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImJlNzgyM2VmMDFiZDRkMmI5NjI3NDE2NThkMjA4MDdlZmVlNmRlNWMiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoi5paJ6Jek56WQ6LyUIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0lVWFJ0M3RhU25hZkdWUkx0bHV3YnRqbEp2MzAwLW1qbDVLTmlvSEdJWkoyWT1zOTYtYyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9tYWdwaWUtNjg0ZTkiLCJhdWQiOiJtYWdwaWUtNjg0ZTkiLCJhdXRoX3RpbWUiOjE3MDI0Njk5MDIsInVzZXJfaWQiOiJoR3JFb1VqWTBDTkp6RnN5OXFMNWhjUXlSNWwxIiwic3ViIjoiaEdyRW9ValkwQ05KekZzeTlxTDVoY1F5UjVsMSIsImlhdCI6MTcwMjQ2OTkwMiwiZXhwIjoxNzAyNDczNTAyLCJlbWFpbCI6Inl1c3VrZS5zYWl0b0BqaWJ1bnN0eWxlLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7Imdvb2dsZS5jb20iOlsiMTA3NTQzMDYyMjI2NzMyMDc2MTI0Il0sImVtYWlsIjpbInl1c3VrZS5zYWl0b0BqaWJ1bnN0eWxlLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6Imdvb2dsZS5jb20ifX0.g7VQuoAZxd20FW8acFalbCmQ5bqwvdHO_sdbhYL67OJLobZJPoRsp9njf5W2t_NOk3WRTEQ63Bg1MRnbIOm3jyFlYu_OJxOPZg_YMjTOm271vGNhn1IyUIWtNhnQyx2LiVpqTF9Tor5SSOU4ZonoX5dROTq8YA4PBTbuvU0FDpqGanE0Lr_qB9tJLhsJEwAasqX5AZs6CjWHUCuINhVIXDphGZ8aVzy1q_mb9EF661csoQsZ2eQOW49PrMp8YpolPLrZhxOp3b8aoQ_4ajfLXWkp55avzJ17ivTWJqxbVJeMiQ7mJTJ-9strBiEV-uBYjfwUDkYqdkce2rieTv8hmA",
             *         "expirationTime": 1702473502181
             *     },
             *     "createdAt": "1702469902128",
             *     "lastLoginAt": "1702469902129",
             *     "apiKey": "AIzaSyDV6W34LcFNPdE7fP9LDE5PciWaBv-CWuQ",
             *     "appName": "[DEFAULT]"
             * }
             */
            if (user) {
                const account: Account = {
                    id: user.uid
                    , email: user.email
                    , photoUrl: user.photoURL
                    , displayName: user.displayName
                    , isEmailVerified: user.emailVerified
                };
                console.log("onAuthStateChanged: signIn", user);
                this.#signInStatus.next(SignInStatuses.signingIn({ account }));
            } else {
                console.log("onAuthStateChanged: signOut");
                this.#signInStatus.next(SignInStatuses.signOut());
            }
        });
    }

    signInStatus(): Observable<SignInStatus> {
        return this.#signInStatus.asObservable();
    }

    createAccount(mailAddress: string, password: string): Observable<Account> {
        return new Observable(subscriber => {
            createUserWithEmailAndPassword(this.#auth, mailAddress, password)
                .then(userCredential => {
                    const user = userCredential.user;
                    subscriber.next({
                        id: user.uid
                        , email: user.email
                        , photoUrl: user.photoURL
                        , displayName: user.displayName
                        , isEmailVerified: user.emailVerified
                    } as Account);
                    subscriber.complete();
                })
                .catch(error => {
                    subscriber.error(error);
                });
        });
    }

    signIn(mailAddress: string, password: string): Observable<Account> {
        return new Observable(subscriber => {
            signInWithEmailAndPassword(this.#auth, mailAddress, password)
                .then(userCredential => {
                    const user = userCredential.user;
                    subscriber.next({
                        id: user.uid
                        , email: user.email
                        , photoUrl: user.photoURL
                        , displayName: user.displayName
                        , isEmailVerified: user.emailVerified
                    } as Account);
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

    oauthToGoogle(scope: string[]): Promise<void> {
        const provider = new GoogleAuthProvider();
        scope.forEach(content => provider.addScope(content));
        return signInWithRedirect(this.#auth, provider);
    }

    getGoogleOAuthRedirectResult(): Promise<UserCredential|null> {
        return getRedirectResult(this.#auth);
    }
}