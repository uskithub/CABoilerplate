import express from "express";
import session, { SessionOptions } from "express-session";

export function setupExpressSession(app: express.Application): express.Application {
    const options: SessionOptions = {
        secret: "keyboard cat"
        , resave: false
        , saveUninitialized: true
        , cookie: { secure: true }
    };
    app.use(session(options));
    return app;
}