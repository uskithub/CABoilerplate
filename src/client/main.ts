// system
import { createApp, watch } from "vue";
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
import { DISPATCHER_KEY, createDispatcher } from "./service/application/performers";
import { SignInStatus } from "@/shared/service/domain/interfaces/authenticator";
import { U } from "@/shared/service/application/usecases";
import { Service } from "@/shared/service/application/actors/service";
import { Subscription } from "rxjs";
import { Nobody } from "robustive-ts";
// import { GraphqlAuthenticator } from "./service/infrastructure/graphqlAuthenticator";

// initialize firebase
const firebaseApp = initializeApp(firebaseConfig);
dependencies.auth = new FirebaseAuthenticator(firebaseApp);
// dependencies.auth = new GraphqlAuthenticator();
dependencies.backend = new FirestoreBackend(getFirestore(firebaseApp));
// dependencies.backend = new AmplifyBackend();
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

const dispatcher = createDispatcher();
const { stores, dispatch } = dispatcher;
app.provide(DISPATCHER_KEY, dispatcher);
app.provide(DICTIONARY_KEY, dictionary);

let subscriptions: Subscription[] = [];
watch(() => stores.shared.signInStatus, (newValue) => {
    if (newValue.case === SignInStatus.signIn) {
        const user = stores.shared.signInStatus.user;
        dispatch(U.observingUsersTasks.basics[Service.usecases.observingUsersTasks.basics.serviceDetectsSigningIn]({ user }))
            .then(subscription => {
                if (subscription !== null) subscriptions.push(subscription);
            });
        
        dispatch(U.observingUsersProjects.basics[Service.usecases.observingUsersProjects.basics.serviceDetectsSigningIn]({ user }))
            .then(subscription => {
                if (subscription !== null) subscriptions.push(subscription);
            });
    } else if (newValue.case === SignInStatus.signingOut) {
        subscriptions.forEach((s) => s.unsubscribe());
        subscriptions = [];
    }
});

if (stores.shared.signInStatus.case === SignInStatus.unknown) {
    dispatch(U.boot.basics[Nobody.usecases.boot.basics.userOpensSite]());
}

app.mount("#app");

