// Service
import { Backend } from "@/shared/service/domain/interfaces/backend";

// Infrastructre
import {  ListWarrantiesQuery } from "@/shared/service/infrastructure/API";
import { Warranty } from "@/shared/service/domain/models/warranty";

import { API } from "aws-amplify";
import { graphqlOperation, GraphQLResult } from "@aws-amplify/api-graphql";

import { GraphQLQuery } from "@aws-amplify/api";
import * as queries from "@/shared/service/infrastructure/graphql/queries";

// System
import { from, Observable } from "rxjs";

export class AmplifyBackend implements Backend {

    getWarranties(): Observable<Warranty[]|null> {
        return from(API.graphql<GraphQLQuery<ListWarrantiesQuery>>(
            graphqlOperation(queries.listWarranties)
        )
            .then((response: GraphQLResult<GraphQLQuery<ListWarrantiesQuery>>) => {
                const errors = response.errors;
                if (errors) {
                    // console.log("GGGGGG error", errors);
                    throw errors;
                }
                // console.log("GGGGGG next", response.data);
                const items = response.data?.listWarranties?.items;
                if (items) {
                    return items.filter(item => item !== null) as Warranty[];
                }
                return null;
            }));
    }
}