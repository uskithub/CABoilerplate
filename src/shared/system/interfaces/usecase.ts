import ServiceModel from "@models/service";
import { User } from "@/shared/service/domain/models/user";
import { Observable, of } from "rxjs";

export interface Usecase<T> {
    context: T;
    /**
     * Usecaseを実行するユーザがそのUsecaseが許可されているかを返します
     */
    authorize: (actor: User|null) => boolean
    next: () => Observable<this>|null;
}

export abstract class AbstractUsecase<T> implements Usecase<T> {
    abstract context: T;
    abstract next(): Observable<this>|null;

    protected instantiate(nextContext: T): this {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return new (this.constructor as any)(nextContext);
    }

    authorize(actor: User|null): boolean {
        return ServiceModel.authorize(actor, this);
    }

    just(nextContext: T): Observable<this> {
        return of(this.instantiate(nextContext));
    }
}