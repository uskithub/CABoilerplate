/* eslint-disable @typescript-eslint/no-explicit-any */
import dependencies from "../dependencies";
import { Boot, BootUsecase } from "../../application/usecases/boot";
import { SignInUsecase } from "../../application/usecases/signIn";
import { SignOutUsecase } from "../../application/usecases/signOut";
import { SignUpUsecase } from "../../application/usecases/signUp";
import { SignInStatusContext } from "../interfaces/authenticator";

import { SignedInUser } from "@/client/service/application/actors/signedInUser";
import { User } from "./user";
import { Usecase, Anyone, Actor } from "robustive-ts";
import { Observable } from "rxjs";


export default {
    signInStatus: (): Observable<SignInStatusContext> => {
        return dependencies.auth.signInStatus();
    }

    , authorize: <V extends Actor<User>, T, U extends Usecase<T>>(actor: V|null, usecase: U): boolean => {

        const isAnyone = (actor: any): actor is Anyone => actor.constructor === Anyone;
        const isSignedInUser = (actor: any): actor is SignedInUser => actor.constructor === SignedInUser;

        switch (usecase.constructor) {
        case BootUsecase: {
            return true;
        }
        case SignUpUsecase: {
            return actor === null;
        }
        case SignInUsecase: {
            return actor === null;
        }
        case SignOutUsecase: {
            return isSignedInUser(actor);
        }
        }

        const isBoot = (usecase: any): usecase is BootUsecase => usecase.constructor === BootUsecase;
        const isSignUp = (usecase: any): usecase is SignUpUsecase => usecase.constructor === SignUpUsecase;
        const isSignIn = (usecase: any): usecase is SignInUsecase => usecase.constructor === SignInUsecase;
        const isSignOut = (usecase: any): usecase is SignOutUsecase => usecase.constructor === SignOutUsecase;

        if (isBoot(usecase)) {
            if (usecase.context.scene === Boot.userOpensSite) {
                // TODO
            }
            return true;
        } else if (isSignUp(usecase)) {
            return true;
        } else if (isSignIn(usecase)) {
            return true;
        } else if (isSignOut(usecase)) {
            return true;
        }
        return false;
    }
};