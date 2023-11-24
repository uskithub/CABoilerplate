import { BaseScenario, Context, IActor, InteractResult, MutableContext, Scenes } from "robustive-ts";
import { Application } from "../../domain/application/application";
import { Actor } from "../actors";
import type { Requirements } from ".";
import { Domain } from "domain";

export abstract class MyBaseScenario<Z extends Scenes> extends BaseScenario<Z> {
    abstract next(to: MutableContext<Z>): Promise<Context<Z>>;

    authorize<Requirements, Domain extends keyof Requirements, Usecase extends keyof Requirements[Domain]>(actor: Actor, domain: Domain, usecase: Usecase): boolean {
        return Application.authorize(actor, usecase);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    complete<Domain extends keyof Requirements, Usecase extends keyof Requirements[Domain], A extends IActor<any>>(withResult: InteractResult<Requirements, Domain, Usecase, A, Z>) {
        // TODO: usecaseの実行結果をログに残す
        console.log(`[COMPLETION] ${ String(withResult.domain) }.${ String(withResult.usecase) } (${ withResult.id })`, withResult);
    }
}