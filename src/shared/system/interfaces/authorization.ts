// const results = ["isRequired", "isTooShort", "isTooLong", "isMalformed"] as const;
// export type ValidationResult = typeof results[number];

export const enum AuthorizationResult {
    isMailAddressNotVerified = "isMailAddressNotVerified"
}

export interface Authorization<Usecase, Result> {
    isAuthorized: true|Result
    usecase: Usecase

    convert<T>(closure: (result: true|Result) => T): T
}

export abstract class AbstructAuthorization<Usecase, Result> implements Authorization<Usecase, Result> {
    isAuthorized: true|Result;
    usecase: Usecase;

    constructor(usecase: Usecase) {
        this.isAuthorized = true;
    }

    authorizers = {
        isRequired: (v:string|null) => !!v || ValidationResult.isRequired
        , isEqualToOrGreaterThan: (v:string|null, minLength: number) => v === null || v.length >= minLength || ValidationResult.isTooShort
        , isEqualToOrLessThan: (v:string|null, maxLength: number) => v === null || v.length <= maxLength || ValidationResult.isTooLong
        , isMailAddress: (v:string|null) => v === null || /.+@.+\..+/.test(v) || ValidationResult.isMalformed
    } as const;

    convert<T>(closure: (result: true|Result) => T): T  {
        return closure(this.isValid);
    }
}