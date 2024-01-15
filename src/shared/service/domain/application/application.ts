/* eslint-disable @typescript-eslint/no-explicit-any */
import dependencies from "../dependencies";
import { SignInStatus } from "../interfaces/authenticator";

// import { Usecase, Nobody, Actor } from "robustive-ts";
import { Observable } from "rxjs";
import { Actor } from "../../application/actors";
import { Service } from "@/shared/system/interfaces/architecture";
import { DomainKeys, UsecaseKeys } from "../../application/usecases";
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

    /**
     * アプリはどのアクターがどのユースケースを実行できるかを制御できなければならない。
     * @param actor 
     * @param usecase 
     * @returns 
     */
    static authorize(actor: Actor, domain: DomainKeys, usecase: UsecaseKeys): boolean {

        switch (usecase) {
        /* Nobody */
        case "boot": {
            return true;
        }
        case "signUp": {
            return isNobody(actor) || isAuthenticatedUser(actor);
        }
        case "signIn": {
            return isNobody(actor);
        }
        case "signOut": 
        case "getWarrantyList": {
            return isAuthorizedUser(actor);
        }
        
        case "observingUsersTasks":
        case "observingUsersProjects":
        case "observingUsersTimeline": {
            return isService(actor);
        }
        }

        // 開発時はここでエラーを発生させた方が分かりやすい
        throw new Error(`USECASE "${ usecase }" IS NOT AUTHORIZED FOR ACTOR "${ actor.constructor.name }."`);
    }
}