import { Entity } from "@/shared/system/interfaces/architecture";

export const LogTypes = {
    text: "text"
} as const;

export type LogTypes = typeof LogTypes[keyof typeof LogTypes];


export type LogProperties = {
    id: string;
    type: LogTypes;
    from: string;
    to: string | null;
    mention: string[] | null;
    text: string | null;
    createdAt: Date;
};


export class Log implements Entity<LogProperties> {

}