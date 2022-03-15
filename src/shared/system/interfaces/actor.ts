import { User } from "@/shared/service/domain/models/user";
import { UserNotAuthorizedToInteract } from "@/shared/service/serviceErrors";
import { Observable, of, throwError } from "rxjs";
import { mergeMap, map } from "rxjs/operators";
import { Usecase } from "./usecase";

export interface Actor {
    user: User|null;
    interactIn<T, U extends Usecase<T>>(initialScene: U): Observable<T[]>
}
export abstract class AbstructActor implements Actor {
    user: User|null;

    constructor(user: User|null = null) {
        this.user = user;
    }

    interactIn<T, U extends Usecase<T>>(initialScene: U): Observable<T[]> {

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

        if (!initialScene.authorize(this.user)) {
            const err = new UserNotAuthorizedToInteract(initialScene.constructor.name);
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