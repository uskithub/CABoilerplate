import { Authenticator, SignInStatusContext } from "@/shared/service/domain/interfaces/authenticator";
import { Unsubscribe } from "firebase/auth";
import { Observable, ReplaySubject } from "rxjs";
import { ApolloClient, InMemoryCache, NormalizedCacheObject, ApolloProvider, useQuery, gql } from "@apollo/client";

export class GraphqlAuthenticator implements Authenticator {
    #client: ApolloClient<NormalizedCacheObject>;
    #unscriber: Unsubscribe;
    #signInStatus: ReplaySubject<SignInStatusContext>;

    constructor() {
        this.#client = new ApolloClient({
            uri: "https://48p1r2roz4.sse.codesandbox.io"
            , cache: new InMemoryCache()
        });

        this.#client
            .query({
                query: gql`
                    query GetRates {
                        rates(currency: "USD") {
                            currency
                        }
                    }
                `
            })
            .then(result => console.log("◯◯", result));
    }

    signInStatus(): Observable<SignInStatusContext> {
        return this.#signInStatus.asObservable();
    }
}