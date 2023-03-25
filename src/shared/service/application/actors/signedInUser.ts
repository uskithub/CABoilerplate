
import { User } from "@/shared/service/domain/models/user";
import { BaseActor } from "robustive-ts";
import { Actor } from ".";

export class SignedInUser extends BaseActor<User> { }
export const isSignedInUser = (actor: Actor): actor is SignedInUser => actor.constructor === SignedInUser;