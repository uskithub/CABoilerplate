// system
import { createApp } from "vue";
import { loadRouter } from "@client/system/plugins/router";
import { loadVuetify } from "@client/system/plugins/vuetify";
import { loadFonts } from "@client/system/plugins/webfontloader";

import App from "./App.vue";
import dependencies from "@shared/service/domain/dependencies";

// fireabse
import { initializeApp } from "firebase/app";
import firebaseConfig from "@client/system/config/firebase.config.json";
import { getFirestore } from "firebase/firestore";
import { FirebaseAuthenticator } from "@client/service/infrastructure/firebaseAuthenticator";
import { FirestoreBackend } from "./service/infrastructure/firestoreBackend";

// Amplify
import { Amplify } from "aws-amplify";
import awsExports from "@client/system/config/aws-exports";
import { AmplifyBackend } from "./service/infrastructure/amplifyBackend";

import { DICTIONARY_KEY, i18n } from "@/shared/system/localizations";
import { ServiceInProcessApi } from "./service/infrastructure/amplify/serviceInProcessApi";
import { FirebaseAnalytics } from "./service/infrastructure/firebaseAnalytics/firebaseAnalytics";
import { OpenaiAssistance } from "@/shared/service/infrastructure/openai/openaiAssistance";
// import { GraphqlAuthenticator } from "./service/infrastructure/graphqlAuthenticator";

// initialize firebase
const firebaseApp = initializeApp(firebaseConfig);
dependencies.auth = new FirebaseAuthenticator(firebaseApp);
// dependencies.auth = new GraphqlAuthenticator();
// dependencies.backend = new FirestoreBackend(getFirestore(firebaseApp));
dependencies.backend = new AmplifyBackend();
dependencies.serviceInProcess = new ServiceInProcessApi();
dependencies.analytics = new FirebaseAnalytics();
OpenaiAssistance.instantiate().then(assistance => {
    dependencies.assistance = assistance;
});

// initialize Amplify
Amplify.configure(awsExports);


loadFonts();

const dictionary = i18n(navigator.language);

const app = createApp(App);

loadRouter(app);
loadVuetify(app);

app.provide(DICTIONARY_KEY, dictionary);
app.mount("#app");

