// eslint-disable-next-line @typescript-eslint/ban-types
export type Empty = {};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Enum<T extends Record<keyof any, Empty>> = {
    [K in keyof T]: Record<"type", K> & T[K];
}[keyof T];
