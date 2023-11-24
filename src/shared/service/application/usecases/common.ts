import { BaseScenario, Context, IActor, InteractResult, MutableContext, Scenes } from "robustive-ts";
import { Application } from "../../domain/application/application";
import { DomainRequirements } from "robustive-ts";

export abstract class MyBaseScenario<Z extends Scenes> extends BaseScenario<Z> {
    abstract next(to: MutableContext<Z>): Promise<Context<Z>>;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authorize<A extends IActor<any>, R extends DomainRequirements, D extends Extract<keyof R, string>, U extends Extract<keyof R[D], string>>(actor: A, domain: D, usecase: U): boolean {
        return Application.authorize(actor, usecase);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    complete<A extends IActor<any>, R extends DomainRequirements, D extends Extract<keyof R, string>, U extends Extract<keyof R[D], string>>(withResult: InteractResult<R, D, U, A, Z>): void {
        // TODO: usecaseの実行結果をログに残す
        console.info(`[COMPLETION] ${ String(withResult.domain) }.${ String(withResult.usecase) } (${ withResult.id })`, withResult);
    }
}