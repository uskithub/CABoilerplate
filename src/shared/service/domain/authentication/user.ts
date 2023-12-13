import { ValidationResult as r, AbstructValidation } from "@/shared/system/interfaces/validation";
import dependencies from "../dependencies";
import { Entity } from "@/shared/system/interfaces/architecture";
import { Observable } from "rxjs";
import { UserCredential as _UserCredential } from "firebase/auth";

export type UserCredential = _UserCredential;

export type Account = {
    uid: string;
    mailAddress: string|null;
    photoUrl: string|null;
    displayName: string|null;
    isMailAddressVerified: boolean;
};

export type UserProperties = {
    isDomainOwner: boolean;
} & Account;

const idValidationResults = [r.isRequired, r.isMalformed] as const;
const passwordValidationResults = [r.isRequired, r.isTooLong, r.isTooShort] as const;

export type IdValidationResult = typeof idValidationResults[number];
export type PasswordValidationResult = typeof passwordValidationResults[number];
export type SignInValidationResult = true | { id: IdValidationResult|null; password: PasswordValidationResult|null; }
export type SignUpValidationResult = SignInValidationResult

export class IdValidation extends AbstructValidation<string, IdValidationResult> {

    isRequired(): this {
        if (this.isValid === true) { this.isValid = this.validators.isRequired(this.input); }
        return this;
    }

    isMailAddress(): this {
        if (this.isValid === true) { this.isValid = this.validators.isMailAddress(this.input); }
        return this;
    }
}

export class PasswordValidation extends AbstructValidation<string, PasswordValidationResult> {

    isRequired(): this {
        if (this.isValid === true) { this.isValid = this.validators.isRequired(this.input); }
        return this;
    }

    isEqualToOrGreaterThan(minLength: number): this {
        if (this.isValid === true) { this.isValid = this.validators.isEqualToOrGreaterThan(this.input, minLength); }
        return this;
    }

    isEqualToOrLessThan(maxLength: number): this {
        if (this.isValid === true) { this.isValid = this.validators.isEqualToOrLessThan(this.input, maxLength); }
        return this;
    }
}

const isUserCredential = (arg: Account | UserCredential): arg is UserCredential => arg.user !== undefined;

export class User implements Entity<UserProperties> {
    account: Account;
    static requiredScope: string[] = ["https://www.googleapis.com/auth/contacts.readonly"];

    constructor(account: Account)
    constructor(userCredential: UserCredential)

    constructor(arg: Account | UserCredential) {
        if (isUserCredential(arg)) {
            this.account = {
                uid: arg.user.uid
                , mailAddress: arg.user.email
                , photoUrl: arg.user.photoURL
                , displayName: arg.user.displayName
                , isMailAddressVerified: arg.user.emailVerified
            };
        } else {
            this.account = arg;
        }
    }

    /**
     * アプリはユーザが入力したIDとパスワードが正しい形式か検証できなければならない。
     * @returns 
     */
    static validate(id: string|null, password: string|null): SignUpValidationResult {
        const idValidationResult = new IdValidation(id)
            .isRequired()
            .isMailAddress()
            .convert(result => (result === true) ? null : result);

        const passwordValidationResult = new PasswordValidation(password)
            .isRequired()
            .isEqualToOrGreaterThan(8)
            .isEqualToOrLessThan(20)
            .convert(result => (result === true) ? null : result);

        if (idValidationResult === null && passwordValidationResult === null) {
            return true;
        } else {
            return { id: idValidationResult, password: passwordValidationResult };
        }
    }

    /**
     * アプリはユーザが入力したIDとパスワードでアカウントを作成できなければならない。
     * @param id 
     * @param password 
     * @returns 
     */
    static createAccount(id: string, password: string): Observable<Account> {
        return dependencies.auth.createAccount(id, password);
    }

    /**
     * アプリはユーザが入力したIDとパスワードでアカウントを認証できなければならない。
     */ 
    static signIn(id: string, password: string): Observable<Account> {
        return dependencies.auth.signIn(id, password);
    }

    static signOut(): Observable<void> {
        return dependencies.auth.signOut();
    }
    
    static oauthToGoogle(): Promise<void> {
        return dependencies.auth.oauthToGoogle(User.requiredScope);
    }

    static getGoogleOAuthRedirectResult(): Promise<UserCredential | null> {
        return dependencies.auth.getGoogleOAuthRedirectResult();
    }

    create(): Promise<UserProperties | null> {
        return dependencies.backend.users.create(this.account);
    }

    get(): Promise<UserProperties | null> {
        return dependencies.backend.users.get(this.account.uid);
    }
}