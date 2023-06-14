import { ValueObject } from "@/shared/system/interfaces/architecture";
import dependencies from "../dependencies";
import { Observable } from "rxjs";

// role
export const Role = {
    system : "system"
    , assistant : "assistant"
    , user : "user"
} as const;

export type Role = typeof Role[keyof typeof Role];

export type MessageProperties = {
    role: Role
    , content: string
}

export class Message implements ValueObject<MessageProperties[]> {
    properties: MessageProperties[];

    constructor(properties: MessageProperties[]) {
        this.properties = properties;
    }

    /**
     * アプリはユーザの質問事項に対して回答を得られなければならない。
     */
    createAnswer() : Observable<MessageProperties[]> { 
        return dependencies.assistance.ask(this.properties);
    }
}