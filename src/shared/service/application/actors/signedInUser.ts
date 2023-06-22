
import { UserProperties } from "@/shared/service/domain/authentication/user";
import { BaseActor } from "robustive-ts";
import { Actor } from ".";

export class SignedInUser extends BaseActor<UserProperties> { }
export const isSignedInUser = (actor: Actor): actor is SignedInUser => actor.constructor === SignedInUser;