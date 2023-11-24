import { BaseScenario, Context, InteractResult, MutableContext, Scenes } from "robustive-ts";
import { Application } from "../../domain/application/application";
import { Actor } from "../actors";
import { DomainRequirements } from "robustive-ts";

export abstract class MyBaseScenario<Z extends Scenes> extends BaseScenario<Z> {
    abstract next(to: MutableContext<Z>): Promise<Context<Z>>;

    authorize<R extends DomainRequirements, D extends Extract<keyof R, string>, U extends Extract<keyof R[D], string>>(actor: Actor, domain: D, usecase: U): boolean {
        return Application.authorize(actor, usecase);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    complete<R extends DomainRequirements, D extends keyof R, U extends keyof R[D]>(withResult: InteractResult<R, D, U, Actor, Z>): void {
        // TODO: usecaseの実行結果をログに残す
        console.info(`[COMPLETION] ${ String(withResult.domain) }.${ String(withResult.usecase) } (${ withResult.id })`, withResult);
    }
}