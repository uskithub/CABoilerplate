/* eslint-disable @typescript-eslint/no-explicit-any */
import dependencies from "../dependencies";
import { Boot, BootUsecase } from "../../application/usecases/nobody/boot";
import { SignInUsecase } from "../../application/usecases/nobody/signIn";
import { SignOutUsecase } from "../../application/usecases/signedInUser/signOut";
import { SignUpUsecase } from "../../application/usecases/nobody/signUp";
import { SignInStatusContext } from "../interfaces/authenticator";

import { isSignedInUser, SignedInUser } from "@/shared/service/application/actors/signedInUser";
// import { Usecase, Nobody, Actor } from "robustive-ts";
import { Observable } from "rxjs";
import { Usecase, isNobody, IContext } from "robustive-ts";
import { Actor } from "../../application/actors";
import { ObservingUsersTasksUsecase } from "../../application/usecases/service/observingUsersTasks";
import { isService } from "../../application/actors/service";
import { GetWarrantyList, GetWarrantyListUsecase } from "../../application/usecases/signedInUser/getWarrantyList";
import { ListInsuranceItemsUsecase } from "../../application/usecases/ServiceInProcess/signedInUser/listInsuaranceItems";


export default {
    signInStatus: (): Observable<SignInStatusContext> => {
        return dependencies.auth.signInStatus();
    }

    , authorize: <Context extends IContext, U extends Usecase<Context>>(actor: Actor, usecase: U): boolean => {
        switch (usecase.constructor) {
        /* ServiceInProcess */
        case ListInsuranceItemsUsecase: {
            return isSignedInUser(actor);
        }
        /* Nobody */
        case BootUsecase: {
            return true;
        }
        case SignUpUsecase: {
            return isNobody(actor);
        }
        case SignInUsecase: {
            return isNobody(actor);
        }
        case GetWarrantyListUsecase: {
            return true;
        }

        /* SignedInUser */
        case SignOutUsecase: {
            return isSignedInUser(actor);
        }

        /* Service */
        case ObservingUsersTasksUsecase: {
            return isService(actor);
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