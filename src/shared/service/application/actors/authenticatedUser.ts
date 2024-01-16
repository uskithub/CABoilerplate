
import { Account } from "@/shared/service/domain/authentication/user";
import { BaseActor } from "robustive-ts";
import { Actor } from ".";

export class AuthenticatedUser extends BaseActor<Account> {
    
}
export const isAuthenticatedUser = (actor: Actor): actor is AuthenticatedUser => actor.constructor === AuthenticatedUser;