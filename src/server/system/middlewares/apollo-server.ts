import express from "express";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";

import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { addResolversToSchema } from "@graphql-tools/schema";
import { loadSchemaSync } from "@graphql-tools/load";
import { join } from "path";

const schema = loadSchemaSync(join(__dirname, "@shared/service/infrastructure/graphql/scheme.graphql"), {
    loaders: [new GraphQLFileLoader()]
});

const books = [
    {
        title: "The Awakening"
        , author: "Kate Chopin"
    }
    , {
        title: "City of Glass"
        , author: "Paul Auster"
    }
];

const resolvers = {
    Query: {
        books: () => books
    }
};

const schemaWithResolvers = addResolversToSchema({ schema, resolvers });

export function setupApolloServer(app: express.Application): express.Application {

    const apolloServer = new ApolloServer({ schema: schemaWithResolvers });
    // const apolloServer = new ApolloServer({ typeDefs, resolvers });

    apolloServer.applyMiddleware({ app });

    return app;
}