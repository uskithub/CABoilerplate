import { Usecases } from "@/shared/service/application/usecases";
import { User } from "@/shared/service/domain/models/user";
import { UserNotAuthorizedToInteract } from "@/shared/service/serviceErrors";
import { Observable, of, throwError } from "rxjs";
import { mergeMap, map } from "rxjs/operators";
import ServiceModel from "@models/service";

interface Scene<T> {
    usecase: Usecases;
    context: T;
    /**
     * Usecaseを実行するユーザがそのUsecaseが許可されているかを返します
     */
    authorize: (actor: User|null) => boolean
    next: () => Observable<this>|null;
}

export abstract class AbstractScene<T> implements Scene<T> {
    abstract usecase: Usecases;
    abstract context: T;
    abstract next(): Observable<this>|null;

    protected instantiate(nextContext: T): this {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return new (this.constructor as any)(nextContext);
    }

    authorize(actor: User|null): boolean {
        return ServiceModel.authorize(this.usecase, actor);
    }

    just(nextContext: T): Observable<this> {
        return of(this.instantiate(nextContext));
    }
}

export class Usecase {
    #actor: User|null;

    constructor(actor: User|null) {
        this.#actor = actor;
    }

    interact<T, U extends Scene<T>>(initialScene: U): Observable<T[]> {

        const _interact = (senario: U[]): Observable<U[]> => {
            const lastScene = senario.slice(-1)[0];
            const observable = lastScene.next();

            // 再帰の終了条件
            if (!observable) {
                // console.log(`[usecase:${lastScene.constructor.name.replace("Scene", "")}:${senario.length-1}:END    ]`, lastScene.context );
                return of(senario);
            } else {
                const tag = (senario.length === 1) ? "START  " : "PROCESS";
                // console.log(`[usecase:${lastScene.constructor.name.replace("Scene", "")}:${senario.length-1}:${tag}]`, lastScene.context );
            }

            // 再帰処理
            return observable
                .pipe(
                    mergeMap((nextScene: U) => {
                        senario.push(nextScene);
                        return _interact(senario);
                    })
                );
        };

        if (!initialScene.authorize(this.#actor)) {
            const err = new UserNotAuthorizedToInteract(initialScene.usecase);
            return throwError(() => err);
        }

        return _interact([initialScene])
            .pipe(
                map((scenes: U[]) => {
                    const performedSenario = scenes.map(scene => scene.context);
                    console.log("performedSenario:", performedSenario);
                    return performedSenario;
                })
            );
    }
}