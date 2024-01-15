import { Analytics } from "./interfaces/analytics";
import { Authenticator } from "./interfaces/authenticator";
import { Presence } from "./interfaces/presence";
import { Backend } from "./interfaces/backend";
import { Notifier } from "./interfaces/notifier";
export interface Dependencies {
    auth: Authenticator;
    presence : Presence;
    backend: Backend;
    analytics: Analytics;
    notification: Notifier;}

export default {
    auth : {} as Authenticator
    , presence : {} as Presence
    , backend : {} as Backend
    , analytics: {} as Analytics
    , notification: {} as Notifier
} as Dependencies;