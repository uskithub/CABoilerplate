import { Authenticator } from "@interfaces/authenticator";

export interface Dependencies {
    auth: Authenticator;
}

export default {
    auth : {} as Authenticator
} as Dependencies;
