
import { UserProperties } from "@/shared/service/domain/authentication/user";
import { BaseActor } from "robustive-ts";
import { Actor } from ".";

export class AuthorizedUser extends BaseActor<UserProperties> {
    
}
export const isAuthorizedUser = (actor: Actor): actor is AuthorizedUser => actor.constructor === AuthorizedUser;