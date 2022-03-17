import ServiceModel from "@models/service";
import { User } from "@/shared/service/domain/models/user";
import { Actor, Usecase } from "robustive-ts";

export class SignedInUser extends Actor<User> {
    #user: User;

    constructor(user: User){
        super();
        this.#user = user;
    }

    authorize<T, U extends Usecase<T>>(usecase: U): boolean {
        return ServiceModel.authorize(this, usecase);
    }
}