type EnumDefs = { [key: string]: string; };

export type ErrorContextFactory<D extends EnumDefs> = { 
    [K in keyof D]: { readonly code: K; readonly message: D[K]; }
};

export const ErrorContextFactory = class ErrorContextFactory<D extends EnumDefs> {
    constructor(defs: D) {
        const codeKeys = Object.keys(defs);
        return new Proxy(this, {
            get(target, prop, receiver) { // prop = code
                return ((typeof prop === "string") && codeKeys.includes(prop))
                    ? Object.freeze({ code: prop, message: defs[prop] })
                    : Reflect.get(target, prop, receiver);
            }
        });
    }
} as new <D extends EnumDefs>(defs: D) => ErrorContextFactory<D>;

export type ErrorContext = {
    readonly code: string;
    readonly message: string;
};

export class SystemError extends Error {
    static {
        this.prototype.name = "SystemError";
    }
    #context: ErrorContext;
    
    constructor(context: ErrorContext, options?: ErrorOptions) {
        super(`${ context.code }: ${ context.message } `, options);
        this.#context = context;

        // Set the prototype explicitly for making "instanceof" available.
        // @see: https://github.com/Microsoft/TypeScript-wiki/blob/main/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        Object.setPrototypeOf(this, new.target.prototype);
    }

    get code(): string {
        return this.#context.code;
    }
}