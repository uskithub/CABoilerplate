
import { UserProperties } from "@/shared/service/domain/authentication/user";
import { Actor } from ".";
import { MyBaseActor } from "../common";
import { DomainKeys, R, UsecaseKeys } from "../usecases";

export class AuthorizedUser extends MyBaseActor<UserProperties> {
    
    isAuthorizedTo(domain: DomainKeys, usecase: UsecaseKeys): boolean {
        if (domain === R.keys.authentication && usecase === R.authentication.keys.signOut) {
            return true;
        }

        return false;
    }
}

export const isAuthorizedUser = (actor: Actor): actor is AuthorizedUser => actor.constructor === AuthorizedUser;