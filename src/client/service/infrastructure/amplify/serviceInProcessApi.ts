// Service
import { ServiceInProcessBackend } from "@/shared/service/domain/ServiceInProcess/interfaces/serviceInProcessBackend";

// Infrastructre
import { createInsuranceItem } from "@/shared/service/infrastructure/graphql/mutations";
import { CreateInsuranceItemInput, CreateInsuranceItemMutation, InsuranceItem, ListInsuranceItemsQuery } from "@/shared/service/infrastructure/API";

import { API } from "aws-amplify";
import { graphqlOperation, GraphQLResult } from "@aws-amplify/api-graphql";
import { GraphQLQuery } from "@aws-amplify/api";
import * as queries from "@/shared/service/infrastructure/graphql/queries";

// System
import { from, Observable } from "rxjs";

export class ServiceInProcessApi implements ServiceInProcessBackend {

    addInsuranceItem(insuranceItem: CreateInsuranceItemInput): Observable<InsuranceItem|null> {
        return from(API.graphql<GraphQLQuery<CreateInsuranceItemMutation>>(
            graphqlOperation(createInsuranceItem, { input: insuranceItem })
        )
            .then((response: GraphQLResult<GraphQLQuery<CreateInsuranceItemMutation>>) => {
                const errors = response.errors;
                if (errors) {
                    console.log("GGGGGG error", errors);
                    throw errors;
                }

                const data = response.data;
                if (data) {
                    const insuranceItem = data.createInsuranceItem;
                    console.log("GGGGGG next", insuranceItem);
                    if (insuranceItem) {
                        return insuranceItem;    
                    }
                }
                return null;
            }));
    }

    listInsuranceItems(): Observable<InsuranceItem[]|null> {
        return from(API.graphql<GraphQLQuery<ListInsuranceItemsQuery>>(
            graphqlOperation(queries.listWarranties)
        )
            .then((response: GraphQLResult<GraphQLQuery<ListInsuranceItemsQuery>>) => {
                const errors = response.errors;
                if (errors) {
                    // console.log("GGGGGG error", errors);
                    throw errors;
                }
                // console.log("GGGGGG next", response.data);
                const items = response.data?.listInsuranceItems?.items;
                if (items) {
                    return items.filter(item => item !== null) as InsuranceItem[];
                }
                return null;
            }));
    }
}