import { User, type SignUpValidationResult, type Account, UserProperties, RoleType } from "@/shared/service/domain/authentication/user";
import { Nobody } from "../../actors/nobody";
import { MyBaseScenario } from "../common";

import type { Context, Empty, MutableContext } from "robustive-ts";
import { firstValueFrom, map, retry } from "rxjs";
import { Organization, OrganizationProperties } from "@/shared/service/domain/authentication/organization";

const _u = Nobody.usecases.signUp;

/**
 * usecase: サインアップする
 */
export type SignUpScenes = {
    basics : {
        [_u.basics.userStartsSignUpProcess]: { id: string | null; password: string | null; };
        [_u.basics.serviceValidateInputs]: { id: string | null; password: string | null; };
        [_u.basics.onSuccessInValidatingThenServicePublishNewAccount]: { id: string; password: string; };
        [_u.basics.onSuccessPublishNewAccountThenServiceCreateUserData]: { account: Account; };
        [_u.basics.onSuccessPublishNewAccountThenServiceGetsOrganizationOfDomain]: { account: Account; };
    };
    alternatives: {
        [_u.alternatives.userStartsSignUpProcessWithGoogleOAuth]: Empty;
        [_u.alternatives.serviceRedirectsToGoogleOAuth]: Empty;
        [_u.alternatives.userTapsSignInButton]: Empty;
        [_u.alternatives.userSelectToBeAdministrator]: { domain: string | null; account: Account | null };
        [_u.alternatives.serviceCreatesNewOrganization]: { domain: string; account: Account };
        [_u.alternatives.userSelectNotToBeAdministrator]: Empty;
        [_u.alternatives.onSuccessCreateNewOrganizationThenThenServiceCreateUserData] : { organizationProperties: OrganizationProperties; account: Account; };
    };
    goals : {
        [_u.goals.onSuccessInCreateUserDataThenServicePresentsHomeView]: { userProperties: UserProperties; };
        [_u.goals.onFailureInValidatingThenServicePresentsError]: { result: SignUpValidationResult; };
        [_u.goals.onFailureInCreateUserDataThenServicePresentsError]: { error: Error; };
        [_u.goals.onFailureInPublishingThenServicePresentsError]: { error: Error; };
        [_u.goals.serviceDoNothing]: Empty;
        [_u.goals.servicePresentsSignInView]: Empty;
        [_u.goals.domainOrganizationNotExistsThenServicePresentsAdministratorRegistrationDialog]: { domain: string; account: Account; };
    };
};

export class SignUpScenario extends MyBaseScenario<SignUpScenes> {

    next(to: MutableContext<SignUpScenes>): Promise<Context<SignUpScenes>> {
        switch (to.scene) {
        case _u.basics.userStartsSignUpProcess: {
            return this.just(this.basics[_u.basics.serviceValidateInputs]({ id: to.id, password: to.password }));
        }
        case _u.basics.serviceValidateInputs: {
            return this.validate(to.id, to.password);
        }
        case _u.basics.onSuccessInValidatingThenServicePublishNewAccount: {
            return this.publishNewAccount(to.id, to.password);
        }
        case _u.basics.onSuccessPublishNewAccountThenServiceGetsOrganizationOfDomain: {
            return this.getOrganization(to.account);
        }
        case _u.basics.onSuccessPublishNewAccountThenServiceCreateUserData: {
            return this.createUser(to.account);
        }
        case _u.alternatives.userStartsSignUpProcessWithGoogleOAuth: {
            return this.just(this.alternatives[_u.alternatives.serviceRedirectsToGoogleOAuth]());
        }
        case _u.alternatives.serviceRedirectsToGoogleOAuth: {
            return this.redirect();
        }
        case _u.alternatives.userTapsSignInButton: {
            return this.just(this.goals[_u.goals.servicePresentsSignInView]());
        }
        case _u.alternatives.userSelectToBeAdministrator: {
            if (to.domain && to.account) {
                return this.just(this.alternatives[_u.alternatives.serviceCreatesNewOrganization]({ domain: to.domain, account: to.account }));
            } else {
                throw new Error();
            }
        }
        case _u.alternatives.serviceCreatesNewOrganization: {
            return this.createNewOrganization(to.domain, to.account);
        }
        case _u.alternatives.onSuccessCreateNewOrganizationThenThenServiceCreateUserData: {
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
            return this.just(this.basics[_u.basics.onSuccessInValidatingThenServicePublishNewAccount]({ id, password }));
        } else {
            return this.just(this.goals[_u.goals.onFailureInValidatingThenServicePresentsError]({ result }));
        }
    }

    private publishNewAccount(id: string, password: string): Promise<Context<SignUpScenes>> {
        return firstValueFrom(
            User
                .createAccount(id, password)
                .pipe(
                    map((account: Account) => {
                        return this.basics[_u.basics.onSuccessPublishNewAccountThenServiceCreateUserData]({ account });
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
                        return this.goals[_u.goals.serviceDoNothing]();
                    } else {
                        return this.goals[_u.goals.domainOrganizationNotExistsThenServicePresentsAdministratorRegistrationDialog]({ domain, account });
                    }
                });
        } else {
            return this.just(this.goals[_u.goals.serviceDoNothing]());
        }
    }

    private createUser(account: Account): Promise<Context<SignUpScenes>> {
        return new User(account).create()
            .then((userProperties) => {
                return this.goals[_u.goals.onSuccessInCreateUserDataThenServicePresentsHomeView]({ userProperties });
            })
            .catch((error: Error) => {
                return this.goals[_u.goals.onFailureInCreateUserDataThenServicePresentsError]({ error });
            });
    }

    private createUserAsOrganizationOwner(account: Account, organizationProperties: OrganizationProperties): Promise<Context<SignUpScenes>> {
        const organizationAndRols = { 
            organizationId: organizationProperties.id
            , role: RoleType.administrator
        };
        
        return new User(account).create(organizationAndRols)
            .then((userProperties) => {
                return this.goals[_u.goals.onSuccessInCreateUserDataThenServicePresentsHomeView]({ userProperties });
            })
            .catch((error: Error) => {
                return this.goals[_u.goals.onFailureInCreateUserDataThenServicePresentsError]({ error });
            });
    }

    private redirect(): Promise<Context<SignUpScenes>> {
        return User
            .oauthToGoogle()
            .then(() => {
                return this.goals[_u.goals.serviceDoNothing]();
            });
    }

    private createNewOrganization(domain: string, account: Account) : Promise<Context<SignUpScenes>> {
        return Organization
            .create(domain, account)    
            .then((organizationProperties: OrganizationProperties) => {
                return this.alternatives[_u.alternatives.onSuccessCreateNewOrganizationThenThenServiceCreateUserData]({ organizationProperties, account }); 
            });
    }
}