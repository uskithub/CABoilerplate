
import { BaseActor } from "robustive-ts";
import { Actor } from ".";

export class Service extends BaseActor<null> {
    
}
export const isService = (actor: Actor): actor is Service => actor.constructor === Service;