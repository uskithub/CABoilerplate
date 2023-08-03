import { BaseScenario, Context, IActor, MutableContext, Scenes } from "robustive-ts";
import { Observable } from "rxjs";
import { Application } from "../../domain/application/application";
import { Actor } from "../actors";
import { UsecaseKeys } from ".";

export abstract class MyBaseScenario<Z extends Scenes> extends BaseScenario<Z> {
    abstract next(to: MutableContext<Z>): Observable<Context<Z>>;

    authorize<User, A extends IActor<User>>(actor: A, usecase: UsecaseKeys): boolean {
        return Application.authorize(actor as Actor, usecase);
    }
}