// service
import Home from "@views/Home.vue";
import SignIn from "@views/SignIn.vue";
import SignUp from "@views/SignUp.vue";

// system
import { createApp } from "vue";
import vuetify from "@/system/plugins/vuetify";
import { loadFonts } from "@/system/plugins/webfontloader";
import { createRouter, createWebHashHistory } from "vue-router";
import App from "./App.vue";
import dependencies from "@/service/domain/dependencies";
import { initializeApp } from "firebase/app";
import firebaseConfig from "@/system/config/firebase.config.json";
import { FirebaseAuthenticator } from "@/service/infrastructure/firebaseAuthenticator";

const firebaseApp = initializeApp(firebaseConfig);
dependencies.auth = new FirebaseAuthenticator(firebaseApp);

const routes = [
    { path: "/", component: Home }
    , { path: "/signin", component: SignIn }
    , { path: "/signup", component: SignUp }
];

const router = createRouter({
    history: createWebHashHistory()
    , routes
});

loadFonts();

const app = createApp(App);
app.use(vuetify);
app.use(router);
app.mount("#app");