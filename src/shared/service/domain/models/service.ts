/* eslint-disable @typescript-eslint/no-explicit-any */
import dependencies from "../dependencies";
import { Boot, BootUsecase } from "../../application/usecases/boot";
import { SignInUsecase } from "../../application/usecases/signIn";
import { SignOutUsecase } from "../../application/usecases/signOut";
import { SignUpUsecase } from "../../application/usecases/signUp";
import { SignInStatusContext } from "../interfaces/authenticator";

import { isSignedInUser, SignedInUser } from "@/shared/service/application/actors/signedInUser";
// import { Usecase, Nobody, Actor } from "robustive-ts";
import { Observable } from "rxjs";
import { Usecase } from "robustive-ts";
import { isNobody } from "robustive-ts";
import { Actor } from "../../application/actors";


export default {
    signInStatus: (): Observable<SignInStatusContext> => {
        return dependencies.auth.signInStatus();
    }

    , authorize: <Context, U extends Usecase<Context>>(actor: Actor, usecase: U): boolean => {
        switch (usecase.constructor) {
            case BootUsecase: {
                return true;
            }
            case SignUpUsecase: {
                return isNobody(actor);
            }
            case SignInUsecase: {
                return isNobody(actor);
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