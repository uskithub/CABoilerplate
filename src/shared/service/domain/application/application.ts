/* eslint-disable @typescript-eslint/no-explicit-any */
import dependencies from "../dependencies";
import { SignInStatus } from "../interfaces/authenticator";

// import { Usecase, Nobody, Actor } from "robustive-ts";
import { Observable } from "rxjs";
import { Actor } from "../../application/actors";
import { Service } from "@/shared/system/interfaces/architecture";
import { DomainKeys, R, UsecaseKeys } from "../../application/usecases";
import { isNobody } from "robustive-ts";
import { isAuthorizedUser } from "../../application/actors/authorizedUser";
import { isService } from "../../application/actors/service";
import { isAuthenticatedUser } from "../../application/actors/authenticatedUser";

export class Application implements Service {

    /**
     * アプリはユーザがサインインしているかどうかを知ることができなければならない。
     * @returns 
     */
    static signInStatus(): Observable<SignInStatus> {
        return dependencies.auth.signInStatus();
    }
}