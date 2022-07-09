import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

export function setupPassportJs(app: express.Application): express.Application {

    passport.use(new LocalStrategy());

    app.use(passport.initialize());
    app.use(passport.session());
    return app;
}