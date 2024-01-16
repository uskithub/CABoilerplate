import { User, type SignUpValidationResult, type Account, UserProperties, RoleType } from "@/shared/service/domain/authentication/user";
import { MyBaseScenario } from "./common";

import type { Context, Empty, MutableContext } from "robustive-ts";
import { firstValueFrom, map, retry } from "rxjs";
import { Organization, OrganizationProperties } from "@/shared/service/domain/authentication/organization";

/**
 * usecase: サインアップする
 */
export type SignUpScenes = {
    basics : {
        userStartsSignUpProcess: { id: string | null; password: string | null; };
        serviceValidateInputs: { id: string | null; password: string | null; };
        onSuccessInValidatingThenServicePublishNewAccount: { id: string; password: string; };
        onSuccessPublishNewAccountThenServiceCreateUserData: { account: Account; };
        onSuccessPublishNewAccountThenServiceGetsOrganizationOfDomain: { account: Account; };
    };
    alternatives: {
        userStartsSignUpProcessWithGoogleOAuth: Empty;
        serviceRedirectsToGoogleOAuth: Empty;
        userTapsSignInButton: Empty;
        userSelectToBeAdministrator: { domain: string | null; account: Account | null };
        serviceCreatesNewOrganization: { domain: string; account: Account };
        userSelectNotToBeAdministrator: Empty;
        onSuccessCreateNewOrganizationThenThenServiceCreateUserData : { organizationProperties: OrganizationProperties; account: Account; };
    };
    goals : {
        onSuccessInCreateUserDataThenServicePresentsHomeView: { userProperties: UserProperties; };
        onFailureInValidatingThenServicePresentsError: { result: SignUpValidationResult; };
        onFailureInCreateUserDataThenServicePresentsError: { error: Error; };
        onFailureInPublishingThenServicePresentsError: { error: Error; };
        serviceDoNothing: Empty;
        servicePresentsSignInView: Empty;
        domainOrganizationNotExistsThenServicePresentsAdministratorRegistrationDialog: { domain: string; account: Account; };
    };
};

export class SignUpScenario extends MyBaseScenario<SignUpScenes> {

    next(to: MutableContext<SignUpScenes>): Promise<Context<SignUpScenes>> {
        switch (to.scene) {
        case this.keys.basics.userStartsSignUpProcess: {
            return this.just(this.basics.serviceValidateInputs({ id: to.id, password: to.password }));
        }
        case this.keys.basics.serviceValidateInputs: {
            return this.validate(to.id, to.password);
        }
        case this.keys.basics.onSuccessInValidatingThenServicePublishNewAccount: {
            return this.publishNewAccount(to.id, to.password);
        }
        case this.keys.basics.onSuccessPublishNewAccountThenServiceGetsOrganizationOfDomain: {
            return this.getOrganization(to.account);
        }
        case this.keys.basics.onSuccessPublishNewAccountThenServiceCreateUserData: {
            return this.createUser(to.account);
        }
        case this.keys.alternatives.userStartsSignUpProcessWithGoogleOAuth: {
            return this.just(this.alternatives.serviceRedirectsToGoogleOAuth());
        }
        case this.keys.alternatives.serviceRedirectsToGoogleOAuth: {
            return this.redirect();
        }
        case this.keys.alternatives.userTapsSignInButton: {
            return this.just(this.goals.servicePresentsSignInView());
        }
        case this.keys.alternatives.userSelectToBeAdministrator: {
            if (to.domain && to.account) {
                return this.just(this.alternatives.serviceCreatesNewOrganization({ domain: to.domain, account: to.account }));
            } else {
                throw new Error();
            }
        }
        case this.keys.alternatives.serviceCreatesNewOrganization: {
            return this.createNewOrganization(to.domain, to.account);
        }
        case this.keys.alternatives.onSuccessCreateNewOrganizationThenThenServiceCreateUserData: {
            // TODO: Dateがclassだからうまいこといっていない
            return this.createUserAsOrganizationOwner(to.account, to.organizationProperties);
        }
        default: {
            throw new Error(`not implemented: ${ to.scene }`);
        }
        }
    }

    private validate(id: string | null, password: string | null): Promise<Context<SignUpScenes>> {
        const result = User.validate(id, password);
        if (result === true && id !== null && password != null) {
            return this.just(this.basics.onSuccessInValidatingThenServicePublishNewAccount({ id, password }));
        } else {
            return this.just(this.goals.onFailureInValidatingThenServicePresentsError({ result }));
        }
    }

    private publishNewAccount(id: string, password: string): Promise<Context<SignUpScenes>> {
        return firstValueFrom(
            User
                .createAccount(id, password)
                .pipe(
                    map((account: Account) => {
                        return this.basics.onSuccessPublishNewAccountThenServiceCreateUserData({ account });
                    })
                )
        );
    }

    private getOrganization(account: Account): Promise<Context<SignUpScenes>> {
        if (account.email) {
            const domain = account.email.split("@")[1];
            return Organization.get(domain)
                .then(organizationProperties => {
                    if (organizationProperties) {
                        return this.goals.serviceDoNothing();
                    } else {
                        return this.goals.domainOrganizationNotExistsThenServicePresentsAdministratorRegistrationDialog({ domain, account });
                    }
                });
        } else {
            return this.just(this.goals.serviceDoNothing());
        }
    }

    private createUser(account: Account): Promise<Context<SignUpScenes>> {
        return new User(account).create()
            .then((userProperties) => {
                return this.goals.onSuccessInCreateUserDataThenServicePresentsHomeView({ userProperties });
            })
            .catch((error: Error) => {
                return this.goals.onFailureInCreateUserDataThenServicePresentsError({ error });
            });
    }

    private createUserAsOrganizationOwner(account: Account, organizationProperties: OrganizationProperties): Promise<Context<SignUpScenes>> {
        const organizationAndRols = { 
            organizationId: organizationProperties.id
            , role: RoleType.administrator
        };
        
        return new User(account).create(organizationAndRols)
            .then((userProperties) => {
                return this.goals.onSuccessInCreateUserDataThenServicePresentsHomeView({ userProperties });
            })
            .catch((error: Error) => {
                return this.goals.onFailureInCreateUserDataThenServicePresentsError({ error });
            });
    }

    private redirect(): Promise<Context<SignUpScenes>> {
        return User
            .oauthToGoogle()
            .then(() => {
                return this.goals.serviceDoNothing();
            });
    }

    private createNewOrganization(domain: string, account: Account) : Promise<Context<SignUpScenes>> {
        return Organization
            .create(domain, account)    
            .then((organizationProperties: OrganizationProperties) => {
                return this.alternatives.onSuccessCreateNewOrganizationThenThenServiceCreateUserData({ organizationProperties, account }); 
            });
    }
}