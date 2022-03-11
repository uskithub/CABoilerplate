import express, { RequestHandler } from "express";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { createServer  } from "vite";

import rootHandler, { helloHandler } from "@server/system/handlers";

import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { addResolversToSchema } from "@graphql-tools/schema";
import { loadSchemaSync } from "@graphql-tools/load";
import { join } from "path";

// const schema = loadSchemaSync(join(__dirname, "@shared/service/infrastructure/graphql/scheme.graphql"), {
//     loaders: [new GraphQLFileLoader()]
// });

// const books = [
//     {
//         title: "The Awakening"
//         , author: "Kate Chopin"
//     }
//     , {
//         title: "City of Glass"
//         , author: "Paul Auster"
//     }
// ];

// const resolvers = {
//     Query: {
//         books: () => books
//     }
// };

// const schemaWithResolvers = addResolversToSchema({ schema, resolvers });

const app = express();
const port = process.env.PORT || "3000";
// const apolloServer = new ApolloServer({ schema: schemaWithResolvers });

// const apolloServer = new ApolloServer({ typeDefs, resolvers });
// apolloServer.applyMiddleware({ app });

// ミドルウェアモードで Vite サーバを作成
createServer({
    server: { middlewareMode: "html" }
})
    .then(vite => {
        // vite の接続インスタンスをミドルウェアとして使用
        app.use(vite.middlewares);
    });

app.get("/api", rootHandler);
app.get("/hello/:name", helloHandler);


app.listen(port, () => {
    return console.log(`Server is listening on ${port}`);
});