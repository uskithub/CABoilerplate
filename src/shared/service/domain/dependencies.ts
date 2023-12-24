import { Analytics } from "./interfaces/analytics";
import { Authenticator } from "./interfaces/authenticator";
import { Presence } from "./interfaces/presence";
import { Backend } from "./interfaces/backend";
import { Notifier } from "./interfaces/notifier";
import { Recollector } from "./interfaces/recollection";
import { Assistance } from "./interfaces/assistance";
import { ServiceInProcessBackend } from "./ServiceInProcess/interfaces/serviceInProcessBackend";


export interface Dependencies {
    auth: Authenticator;
    presence : Presence;
    backend: Backend;
    serviceInProcess: ServiceInProcessBackend;
    analytics: Analytics;
    notification: Notifier;
    recollection: Recollector;
    assistance: Assistance;

}

export default {
    auth : {} as Authenticator
    , presence : {} as Presence
    , backend : {} as Backend
    , serviceInProcess : {} as ServiceInProcessBackend
    , analytics: {} as Analytics
    , notification: {} as Notifier
    , recollection: {} as Recollector
    , assistance: {} as Assistance
} as Dependencies;