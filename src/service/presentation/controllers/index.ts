import { InjectionKey, reactive } from "vue";
import CommonController from "./common";

export type Controllers = {
    common: CommonController;
}

export function createControllers(): Controllers {

    return {
        common: new CommonController()
    };
}

export const CONTROLLERS_KEY = Symbol("Controllers") as InjectionKey<Controllers>;
