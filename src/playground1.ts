import { Observable, Observer, of, Subscription, tap, throwError } from "rxjs";
import { mergeMap, map } from "rxjs/operators";
import { UserProperties } from "./shared/service/domain/authentication/user";

export type Boundary = null;
export const boundary: Boundary = null;

export type ContextualValues = Record<string, object>;
export type Empty = Record<string, never>;

type DeepReadonly<T> = T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;

// Discriminated Union
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Context<T extends ContextualValues> = {
    readonly [K in keyof T]: DeepReadonly<T[K] extends Empty 
        ? Record<"scene", K> 
        : Record<"scene", K> & T[K]>;
}[keyof T];

const courses = ["basics", "alternatives", "goals"] as const;
type Courses = typeof courses[number];
type Basics = Extract<Courses, "basics">;
type Alternatives = Extract<Courses, "alternatives">;
type Goals = Extract<Courses, "goals">;

type Scenes = {
    [K in Courses]: ContextualValues;
};

type Scenario<Z extends Scenes, S extends IScenario<Z>> = S & Context<Z[Courses]>;

interface IScenario<Z extends Scenes> {
    next(): Observable<this> | Boundary;
    just(): Observable<this>;
    // interactedBy<U>(actor: U): Observable<Scenario<Z, Courses, this>[]>
    interactedBy<U>(actor: U): Observable<this[]>
    // interactedBy<U>(actor: U, observer: Partial<Observer<[Scenario<Z, Courses, this>, Scenario<Z, Courses, this>[]]>>): Subscription
    interactedBy<U>(actor: U, observer: Partial<Observer<[this, this[]]>>): Subscription
}

abstract class BaseScenario<Z extends Scenes> implements IScenario<Z> {
    // abstract next(): Observable<Scenario<Z, Courses, this>> | Boundary;
    abstract next(): Observable<this> | Boundary;
    just() {
        return of(this);
    }

    // interactedBy<U>(actor: U): Observable<Scenario<Z, Courses, this>[]>
    interactedBy<U>(actor: U): Observable<this[]>
    // interactedBy<U>(actor: U, observer: Partial<Observer<[Scenario<Z, Courses, this>, Scenario<Z, Courses, this>[]]>>): Subscription
    interactedBy<U>(actor: U, observer: Partial<Observer<[this, this[]]>>): Subscription

    // overload
    // interactedBy<U>(actor: U, observer?: Partial<Observer<[Scenario<Z, Courses, this>, Scenario<Z, Courses, this>[]]>> | null): Observable<Scenario<Z, Courses, this>[]> | Subscription {
    interactedBy<U>(actor: U, observer?: Partial<Observer<[this, this[]]>> | null): Observable<this[]> | Subscription {
        if (observer) {
            let subscription: Subscription | null = null;
            subscription = this.interactedBy(actor)
                .subscribe({ 
                    // next: (performedScenario: Scenario<Z, Courses, this>[]) => {
                    next: (performedScenario: this[]) => {
                        const lastSceneContext = performedScenario.slice(-1)[0];
                        observer.next?.([lastSceneContext, performedScenario]);
                    }
                    , error: (err) => {
                        console.error(err);
                        observer.error?.(err);
                    }
                    , complete: () => { 
                        subscription?.unsubscribe();
                        observer.complete?.(); 
                    } 
                // } as Partial<Observer<Scenario<Z, Courses, this>[]>>);
                } as Partial<Observer<this[]>>);
            return subscription;

        } else {
            const startAt = new Date();
            // const recursive = (scenario: Scenario<Z, Courses, this>[]): Observable<Scenario<Z, Courses, this>[]> => {
            const recursive = (scenario: this[]): Observable<this[]> => {
                const lastScene: this = scenario.slice(-1)[0];
                // => type Scenario<Z extends Scenes, C extends Courses, S extends IScenario<Z>> = S & Context<Z[C]>;
                // {
                //     readonly [K in keyof T]: DeepReadonly<T[K] extends Empty 
                //     ? Record<"scene", K> 
                //     : Record<"scene", K> & T[K]>;
                // }[keyof T];
                const observable = lastScene.next();
                // BaseScenario<Z> & ({
                //     readonly scene: DeepReadonly<keyof Z[Courses]>;
                // } | {
                //     readonly scene: DeepReadonly<keyof Z[Courses]>;
                // })
    
                if (!observable) { // exit criteria
                    return of(scenario);
                }
    
                return observable
                    .pipe(
                        mergeMap((nextScene) => {
                            scenario.push(nextScene);
                            return recursive(scenario);
                        })
                    );
            };
    
            // if (!this.authorize(actor)) {
            //     const err = new ActorNotAuthorizedToInteractIn(actor.constructor.name, this.constructor.name);
            //     return throwError(() => err);
            // }
            const scenario: this[] = [this];
    
            return recursive(scenario)
                .pipe(
                    // map((scenes: this[]) => scenes.map(scene => scene as Context<Z[Courses]>))
                    tap(scenario => {
                        const elapsedTime = (new Date().getTime() - startAt.getTime());
                        console.info(`${ this.constructor.name } takes ${elapsedTime } ms.`, scenario);
                    })
                );
        }
    }
}

type ExtractScenes<S> = S extends IScenario<infer Z> ? Z : never;

type Course<C extends Courses, S extends IScenario<ExtractScenes<S>>> = { 
    [K in keyof ExtractScenes<S>[C]]: ExtractScenes<S>[C][K] extends Empty // K = ユーザはアプリを起動する
        ? () => Record<"usecase", string> & { from: Scenario<ExtractScenes<S>, S> }
        : (withValues: ExtractScenes<S>[C][K]) => Record<"usecase", string> & { from: Scenario<ExtractScenes<S>, S> }
};

const Course = class Course<S extends IScenario<ExtractScenes<S>>> {
    constructor(usecase: string, s: (new () => S)) {
        return new Proxy(this, {
            get(target, prop, receiver) { // prop = ユーザはアプリを起動する
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return ((typeof prop === "string") && !(prop in target)) 
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment
                    ? (withValues: any) => Object.freeze({ usecase : usecase, from: Object.assign(new s(), { "scene" : prop, ...withValues })}) // <-- Scenario
                    : Reflect.get(target, prop, receiver);
            }
        });
    }
} as new <C extends Courses, S extends IScenario<ExtractScenes<S>>>(usecase: string, s: (new () => S)) => Course<C, S>; // proxyを使うので、typeを別途作る必要あり

class Usecase<S extends IScenario<ExtractScenes<S>>> {
    basics: Course<Basics, S>;
    alternatives: Course<Alternatives, S>;
    goals: Course<Goals, S>;
  
    constructor(usecase: string, scenario: (new () => S)) {
        this.basics = new Course<Basics, S>(usecase, scenario);
        this.alternatives = new Course<Alternatives, S>(usecase, scenario);
        this.goals = new Course<Goals, S>(usecase, scenario);
    }
}

// type ScenarioConstructor<Z extends Scenes, S extends IScenario<Z>> = new () => S;

type UsecaseDefinitions = Record<string, IScenario<Scenes>>;

type UsecaseFactory<D extends UsecaseDefinitions> = { 
    [U in keyof D]: (arg: new () => D[U]) => Usecase<D[U]>
};

const UsecaseFactory = class UsecaseFactory {
    constructor() {
        return new Proxy(this, {
            get(target, prop, receiver) { // prop = booting
                return ((typeof prop === "string") && !(prop in target)) 
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
                    ? (arg: any) => new Usecase(prop, arg)//(prop, D[typeof prop]["scenario"]) 
                    : Reflect.get(target, prop, receiver);
            }
        });
    }
} as new <D extends UsecaseDefinitions>() => UsecaseFactory<D>; // proxyを使うので、typeを別途作る必要あり

type BootingScenes = {
    basics: {
      "UDIDがある場合_アプリはユーザがチュートリアルを完了した記録がないかを調べる": { udid: string };
    }
    , alternatives : Empty
    , goals: {
        "チュートリアル完了の記録がある場合_アプリはログイン画面を表示" : { udid: string };
    }
};

class BootScenario extends BaseScenario<BootingScenes> { 
    next(): Observable<this>|Boundary {
        // switch (this) {
        // case scenes.userOpensSite: {
        //     return this.just({ scene: Boot.serviceChecksSession });
        // }
        // case scenes.serviceChecksSession : {
        //     return this.check();
        // }
        // case scenes.goals.sessionExistsThenServicePresentsHome:
        // case scenes.goals.sessionNotExistsThenServicePresentsSignin:
        // case scenes.goals.onUpdateUsersTasksThenServiceUpdateUsersTaskList: {
        return boundary;
        // }
        // }
    }
}
class SignInScenario extends BaseScenario<SignInScenes> { next() { return boundary; } }

type SignInScenes = {
    basics: {
      "ユーザはサインインを開始する" : { id: string, password: string };
    }
    , alternatives : Empty
    , goals: {
        "サインインに成功した場合_サービスはホーム画面を表示する" : { user: UserProperties; };
    }
};

type Usecases = { 
    booting: BootScenario;
    signIn: SignInScenario;
};

const Usecases = new UsecaseFactory<Usecases>();

const usecase1 = Usecases.booting(BootScenario).basics.UDIDがある場合_アプリはユーザがチュートリアルを完了した記録がないかを調べる({ udid: "my-udid" });

// console.log(`usecase: ${ usecase1.usecase}, from: ${ usecase1.from.scene }`);

/*
{ 
    usecase: "Booting"
    , initialScene: { 
        scene: "UDIDがある場合_アプリはユーザがチュートリアルを完了した記録がないかを調べる"
        , udid: "dummy"
    }
}
*/


let subscription: Subscription | null = null;
subscription = usecase1.from.interactedBy("user", {
    next: ([lastSceneContext, performedScenario]) => {

        console.log("next:", performedScenario);
        
        // switch (lastSceneContext.scene) {
        // case Boot.goals.sessionExistsThenServicePresentsHome: {
        //     const user = { ...lastSceneContext.user };
        //     const actor = new SignedInUser(user);
        //     dispatcher.change(actor);
        //     _shared.signInStatus = SignInStatus.signIn;
        //     console.log("hhhh", _shared.actor, _shared.signInStatus);
        //     // controller.dispatch({ scene: ObservingUsersTasks.serviceDetectsSigningIn, user });
        //     break;
        // }
        // case Boot.goals.sessionNotExistsThenServicePresentsSignin: {
        //     _shared.signInStatus = SignInStatus.signOut;
        //     router.replace("/signin")
        //         .catch((error) => {
        //         });
        //     break;
        // }
        // }
    }
});