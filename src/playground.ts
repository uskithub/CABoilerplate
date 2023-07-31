import { Observable, Subscription } from "rxjs";
import { UserProperties } from "./shared/service/domain/authentication/user";
import { BaseScenario, UsecaseSelector } from "robustive-ts";
import type { Context, Empty, Usecases as Us, UsecaseDefinitions } from "robustive-ts";

type PreFlatten<S> = {
    [C in keyof S as C extends string ? `${C}.${keyof S[C] & string}`: C] : S[C];
};

type Flatten<S> = {
    [CK in keyof PreFlatten<S>] : CK extends `${infer C extends keyof S & string}.${string}`
        ? CK extends `${string}.${infer K extends keyof S[C] & string}`
            ? S[C][K] 
            : never
        : never;
};

const bootScenes = {
    basics: {
        basic_scene_01: "晴れの日コースのはじめ"
        , basic_scene_02: "晴れの日コースの２番目"
    }
    , alternatives : {
        alternate_scene_01: "雨の日コースの１番目"
        , alternate_scene_02: "雨の日コースの２番目"
    }
    , goals: {
        last_scene_01: "バウンダリーの１番目"
        , last_scene_02: "バウンダリーの２番目"
    }
} as const;

const _u = bootScenes;

type BootScenes = {
    basics: {
        [_u.basics.basic_scene_01]: { udid: string };
        [_u.basics.basic_scene_02]: { session: string };
    };
    alternatives : {
        [_u.alternatives.alternate_scene_01]: { udid: string };
        [_u.alternatives.alternate_scene_02]: { session: string };
    };
    goals: {
        [_u.goals.last_scene_01]: { udid: string };
        [_u.goals.last_scene_02]: { session: string };
    };
};

const signInScenes = {
    basics: {
        basic_scene_01: "晴れの日コースのはじめ"
        , basic_scene_02: "晴れの日コースの２番目"
    }
    , goals: {
        last_scene_01: "バウンダリーの１番目"
        , last_scene_02: "バウンダリーの２番目"
    }
} as const;

const _u2 = bootScenes;

type SignInScenes = {
    basics: {
        [_u2.basics.basic_scene_01]: { udid: string };
        [_u2.basics.basic_scene_02]: { session: string };
    };
    alternatives: Empty;
    goals: {
        [_u2.goals.last_scene_01]: { udid: string };
        [_u2.goals.last_scene_02]: { session: string };
    };
};

const signUpScenes = {
    basics: {
        basic_scene_01: "晴れの日コースのはじめ"
        , basic_scene_02: "晴れの日コースの２番目"
    }
    , goals: {
        last_scene_01: "バウンダリーの１番目"
        , last_scene_02: "バウンダリーの２番目"
    }
} as const;

const _u3 = bootScenes;

type SignUpScenes = {
    basics: {
        [_u3.basics.basic_scene_01]: { udid: string };
        [_u3.basics.basic_scene_02]: { session: string };
    };
    alternatives: Empty;
    goals: {
        [_u3.goals.last_scene_01]: { udid: string };
        [_u3.goals.last_scene_02]: { session: string };
    };
};

type PFBootScenes = PreFlatten<BootScenes>;
type FBootScenes = Flatten<BootScenes>;

type PFSignInScenes = PreFlatten<SignInScenes>;
type FSignInScenes = Flatten<SignInScenes>;

type PFSignUpScenes = PreFlatten<SignUpScenes>;
type FSignUpScenes = Flatten<SignUpScenes>;

class BootScenario extends BaseScenario<BootScenes> {
    next(to: Context<BootScenes>): Observable<Context<BootScenes>> {
        switch (to.scene) {
        case _u.basics.basic_scene_01: {
            console.log("basic_scene_01", to.udid);
            const nextScene = this.goals.バウンダリーの１番目({ udid: to.udid });
            return this.just(nextScene);
        }
        case _u.alternatives.alternate_scene_02: {
            const nextScene = this.goals.バウンダリーの２番目({ session: to.session });
            return this.just(nextScene);
        }
        default: {
            throw new Error(`not implemented: ${ to.scene }`);
        }
        }
    } 
}
class SignInScenario extends BaseScenario<SignInScenes> { 
    next(to: Context<SignInScenes>) : Observable<Context<SignInScenes>> {
        switch (to.scene) {
        case _u2.basics.basic_scene_01: {
            const nextScene = this.goals[_u2.goals.last_scene_01]({ 
                udid: to.udid
            });
            return this.just(nextScene);
        }
        default: {
            throw new Error(`not implemented: ${ to.scene }`);
        }
        }
    } 
}

class SignUpScenario extends BaseScenario<SignUpScenes> { 
    next(to: Context<SignUpScenes>) : Observable<Context<SignUpScenes>> {
        switch (to.scene) {
        case _u3.basics.basic_scene_01: {
            const nextScene = this.goals[_u3.goals.last_scene_01]({ 
                udid: to.udid
            });
            return this.just(nextScene);
        }
        default: {
            throw new Error(`not implemented: ${ to.scene }`);
        }
        }
    } 
}

type Usecases = { 
    booting: { scenes: BootScenes; scenario: BootScenario; };
    signIn: { scenes: SignInScenes; scenario: SignInScenario; };
    signUp: { scenes: SignUpScenes; scenario: SignUpScenario; };
};

type hoge = Context<BootScenes>;

const _Usecases = new UsecaseSelector<Usecases>();

// const usecase2 = Usecases.booting(BootScenario).basics.晴れの日コースの２番目({ session: "m" });

// // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
const usecase1 = _Usecases
    .booting(BootScenario)
    .basics[bootScenes.basics.basic_scene_01]({ "udid": "HHHH" })
    ;

const usecase = _Usecases.booting(BootScenario).basics.晴れの日コースのはじめ({ udid: "HHHH" });
const hoge = usecase.from;

_Usecases.signIn(SignInScenario);

const dispatch = (usecase: Us<Usecases>) => {
    switch (usecase.name) {
    case "booting": {
        usecase.from;
    }
    }
};


let subscription: Subscription | null = null;
subscription = usecase1.from.interactedBy("user", {
    next: ([lastSceneContext]) => {
        switch (lastSceneContext.scene) {
        case _u.goals.last_scene_01: {
            console.log("LAST 01", lastSceneContext.udid);
            break;
        }
        case _u.goals.last_scene_02: {
            console.log("LAST 02", lastSceneContext.session);
            break;
        }
        }
    }
    , error: (error) => {
        console.error(error);
    }
});