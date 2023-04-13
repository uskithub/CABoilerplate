import { Backend } from "@/shared/service/domain/interfaces/backend";
import { Warranty } from "@/shared/service/domain/models/warranty";
import { Observable } from "rxjs";

import { API } from "aws-amplify";
import { GraphQLResult } from "@aws-amplify/api-graphql";
import { listPosts } from "@graphql/queries";
import { Post, ListPostsQuery } from "@api";
import { GraphQLError } from "graphql";

export class AmplifyBackend implements Backend {

    constructor() {}

    getWarranties(): Observable<Post[]> {
        return new Observable(subscriber => {
            return API.graphql<ListPostsQuery>({
                query: listPosts
              })
              .then((response: GraphQLResult<ListPostsQuery>) => {
                const data: ListPostsQuery | undefined = response.data;
                const { listPosts } = data;
                const { items, nextToken } = listPosts;
                if (items) {
                    subscriber.next(items);
                    console.log("GGGGGG next", items);
                    // subscriber.complete();
                    return;
                }
                const errors: GraphQLError[] | undefined = response.errors;
                if (errors) {
                    subscriber.error(errors);
                    console.log("GGGGGG error", errors);
                    // subscriber.complete();
                    return;
                }
                console.error("itemsもerrorsもない", response);
              });
        });
    }
}