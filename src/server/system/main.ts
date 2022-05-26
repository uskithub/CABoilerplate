import express, { RequestHandler } from "express";

import rootHandler, { helloHandler } from "@server/system/handlers";

import { setupViteServer } from "./middlewares/viteServer";
import { setupExpressSession } from "@server/system/middlewares/express-session";
import { setupPassportJs } from "@server/system/middlewares/passport";


const app = express();
const port = process.env.PORT || "3000";

setupViteServer(app)
    .then(app => {
        return setupExpressSession(app);
    })
    .then(app => {
        return setupPassportJs(app);
    });


app.get("/api", rootHandler);
app.get("/hello/:name", helloHandler);


app.listen(port, () => {
    return console.log(`Server is listening on ${port}`);
});