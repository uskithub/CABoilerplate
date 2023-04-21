// service
import { routes } from "@views/index";
// system
import { App } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
    history: createWebHashHistory()
    , routes
});

export function loadRouter(app: App<Element>) {
    app.use(router);
}