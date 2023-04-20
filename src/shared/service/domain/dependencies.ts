import { Authenticator } from "./interfaces/authenticator";
import { Backend } from "./interfaces/backend";
import { ServiceInProcessBackend } from "./ServiceInProcess/interfaces/serviceInProcessBackend";


export interface Dependencies {
    auth: Authenticator;
    backend: Backend;
    serviceInProcess: ServiceInProcessBackend;
}

export default {
    auth : {} as Authenticator
    , backend : {} as Backend
    , serviceInProcess : {} as ServiceInProcessBackend
} as Dependencies;