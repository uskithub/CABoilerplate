import { Analytics } from "./interfaces/analytics";
import { Authenticator } from "./interfaces/authenticator";
import { Backend } from "./interfaces/backend";
import { Notifier } from "./interfaces/notifier";
import { ServiceInProcessBackend } from "./ServiceInProcess/interfaces/serviceInProcessBackend";


export interface Dependencies {
    auth: Authenticator;
    backend: Backend;
    serviceInProcess: ServiceInProcessBackend;
    analytics: Analytics;
    notification: Notifier;
}

export default {
    auth : {} as Authenticator
    , backend : {} as Backend
    , serviceInProcess : {} as ServiceInProcessBackend
    , analytics: {} as Analytics
    , notification: {} as Notifier
} as Dependencies;