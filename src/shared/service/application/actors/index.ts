import { Nobody } from "./nobody";
import { SignedInUser } from "./signedInUser";
import { Service } from "./service";

export type Actor = Nobody | SignedInUser | Service;