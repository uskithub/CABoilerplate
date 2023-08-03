import { Observable, Subscription } from "rxjs";
import { BaseActor, BaseScenario, Nobody, UsecaseSelector } from "robustive-ts";
import type { Context, Empty, MutableContext, Usecases, Usecase, IActor } from "robustive-ts";

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

const _u2 = signInScenes;

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

const _u3 = signUpScenes;

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

type UserProperties = {
    uid: string;
    mailAddress: string|null;
    photoUrl: string|null;
    displayName: string|null;
    isMailAddressVerified: boolean;
};

class SignedInUser extends BaseActor<UserProperties> {}

type Actor = Nobody | SignedInUser;

class BootScenario extends BaseScenario<BootScenes> {
    
    authorize<A extends Actor>(actor: A, usecase: keyof UsecaseDefinitions): boolean { return true; }

    next(to: MutableContext<BootScenes>): Observable<Context<BootScenes>> {
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
    
    authorize<Usecases, Actor>(actor: Actor, usecase: keyof Usecases): boolean { return true; }

    next(to: MutableContext<SignInScenes>) : Observable<Context<SignInScenes>> {
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
    
    authorize<Usecases, Actor>(actor: Actor, usecase: keyof Usecases): boolean { return true; }

    next(to: MutableContext<SignUpScenes>) : Observable<Context<SignUpScenes>> {
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

type UsecaseDefinitions = { 
    booting: { scenes: BootScenes; scenario: BootScenario; };
    signIn: { scenes: SignInScenes; scenario: SignInScenario; };
    signUp: { scenes: SignUpScenes; scenario: SignUpScenario; };
};


const _Usecases = new UsecaseSelector<UsecaseDefinitions>();

type hoge = Usecases<UsecaseDefinitions>;

// const usecase2 = Usecases.booting(BootScenario).basics.晴れの日コースの２番目({ session: "m" });

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
const usecase1 = _Usecases
    .booting(BootScenario)
    .basics[bootScenes.basics.basic_scene_01]({ "udid": "HHHH" })
    ;

const usecase = _Usecases.booting(BootScenario).basics.晴れの日コースのはじめ({ udid: "HHHH" });

_Usecases.signIn(SignInScenario);

const dispatch = (usecase: Usecases<UsecaseDefinitions>) => {
    switch (usecase.name) {
    case "booting": {
        const hoge: Usecase<UsecaseDefinitions, "booting"> = usecase;
    }
    }
};


let subscription: Subscription | null = null;
subscription = usecase1.interactedBy(new Nobody(), {
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