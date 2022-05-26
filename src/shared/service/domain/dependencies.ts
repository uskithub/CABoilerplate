import { Authenticator } from "./interfaces/authenticator";
import { Backend } from "./interfaces/backend";


export interface Dependencies {
    auth: Authenticator;
    backend: Backend;
}

export default {
    auth : {} as Authenticator
    , backend : {} as Backend
} as Dependencies;