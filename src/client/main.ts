// service
import Home from "@views/Home.vue";
import SignIn from "@views/SignIn.vue";
import SignUp from "@views/SignUp.vue";

// system
import { createApp } from "vue";
import vuetify from "@client/system/plugins/vuetify";
import { loadFonts } from "@client/system/plugins/webfontloader";
import { createRouter, createWebHashHistory } from "vue-router";
import App from "./App.vue";
import dependencies from "@shared/service/domain/dependencies";
import { initializeApp } from "firebase/app";
import firebaseConfig from "@client/system/config/firebase.config.json";
import { FirebaseAuthenticator } from "@client/service/infrastructure/firebaseAuthenticator";
import { DICTIONARY_KEY, i18n } from "@/shared/system/localizations";
// import { GraphqlAuthenticator } from "./service/infrastructure/graphqlAuthenticator";

const firebaseApp = initializeApp(firebaseConfig);
dependencies.auth = new FirebaseAuthenticator(firebaseApp);
// dependencies.auth = new GraphqlAuthenticator();

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

const dictionary = i18n(navigator.language);

const app = createApp(App);
app.use(vuetify);
app.use(router);
app.mount("#app");
app.provide(DICTIONARY_KEY, dictionary);
