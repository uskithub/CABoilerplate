/* eslint-disable @typescript-eslint/no-explicit-any */
import dependencies from "../dependencies";
import { SignInStatus } from "../interfaces/authenticator";

// import { Usecase, Nobody, Actor } from "robustive-ts";
import { Observable } from "rxjs";
import { Actor } from "../../application/actors";
import { Service } from "@/shared/system/interfaces/architecture";
import { isNobody } from "robustive-ts";
import { isSignedInUser } from "../../application/actors/signedInUser";
import { UsecaseKeys } from "../../application/usecases";
import { isService } from "../../application/actors/service";

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
    static authorize(actor: Actor, usecase: UsecaseKeys): boolean {

        switch (usecase) {
        /* Nobody */
        case "boot": {
            return true;
        }
        case "signUp":
        case "signIn": {
            return isNobody(actor);
        }
        case "signOut": 
        case "consult": 
        case "getWarrantyList": 
        case "listInsuranceItems": {
            return isSignedInUser(actor);
        }
        case "observingUsersTasks":
        case "observingUsersProjects": {
            return isService(actor);
        }
        }

        // 開発時はここでエラーを発生させた方が分かりやすい
        throw new Error(`USECASE "${ usecase }" IS NOT AUTHORIZED FOR ACTOR "${ actor.constructor.name }."`);
    }
}