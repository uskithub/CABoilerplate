import { Nobody } from "robustive-ts";
import { SignedInUser } from "./signedInUser";
import { Service } from "./service";

export type Actor = Nobody | SignedInUser | Service;