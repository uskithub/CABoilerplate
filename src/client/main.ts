// system
import { createApp } from "vue";
import { loadRouter } from "@client/system/plugins/router";
import { loadVuetify } from "@client/system/plugins/vuetify";
import { loadFonts } from "@client/system/plugins/webfontloader";

import App from "./App.vue";
import dependencies from "@shared/service/domain/dependencies";
import { initializeApp } from "firebase/app";
import firebaseConfig from "@client/system/config/firebase.config.json";
import { getFirestore } from "firebase/firestore";
import { FirebaseAuthenticator } from "@client/service/infrastructure/firebaseAuthenticator";
import { DICTIONARY_KEY, i18n } from "@/shared/system/localizations";
import { FirestoreBackend } from "./service/infrastructure/firestoreBackend";
// import { GraphqlAuthenticator } from "./service/infrastructure/graphqlAuthenticator";

const firebaseApp = initializeApp(firebaseConfig);
dependencies.auth = new FirebaseAuthenticator(firebaseApp);
// dependencies.auth = new GraphqlAuthenticator();
dependencies.backend = new FirestoreBackend(getFirestore(firebaseApp));

loadFonts();

const dictionary = i18n(navigator.language);

const app = createApp(App);

loadRouter(app);
loadVuetify(app);

app.mount("#app");
app.provide(DICTIONARY_KEY, dictionary);

