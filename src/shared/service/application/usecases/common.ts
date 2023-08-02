import { BaseScenario, Context, MutableContext, Scenes } from "robustive-ts";
import { Observable } from "rxjs";
import { Application } from "../../domain/application/application";
import { UsecaseDefinitions } from ".";
import { Actor } from "../actors";

export abstract class MyBaseScenario<Z extends Scenes> extends BaseScenario<Z> {
    abstract next(to: MutableContext<Z>): Observable<Context<Z>>;

    authorize<User, A extends IActor<User>>(actor: A, usecase: keyof UsecaseDefinitions): boolean {
        return Application.authorize(actor as Actor, usecase);
    }
}