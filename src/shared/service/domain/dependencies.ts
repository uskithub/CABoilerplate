import { Analytics } from "./interfaces/analytics";
import { Authenticator } from "./interfaces/authenticator";
import { Backend } from "./interfaces/backend";
import { Notifier } from "./interfaces/notifier";
import { Recollector } from "./interfaces/recollection";
import { Assistance } from "./interfaces/assistance";
import { ServiceInProcessBackend } from "./ServiceInProcess/interfaces/serviceInProcessBackend";

import { FirebaseAuthenticator } from "@/client/service/infrastructure/firebaseAuthenticator";

// fireabse
import { initializeApp } from "firebase/app";
import firebaseConfig from "@client/system/config/firebase.config.json";
import { AmplifyBackend } from "@/client/service/infrastructure/amplifyBackend";
import { ServiceInProcessApi } from "@/client/service/infrastructure/amplify/serviceInProcessApi";
import { FirebaseAnalytics } from "@/client/service/infrastructure/firebaseAnalytics/firebaseAnalytics";
import { OpenaiAssistance } from "../infrastructure/openai/openaiAssistance";


export interface Dependencies {
    auth: Authenticator;
    backend: Backend;
    serviceInProcess: ServiceInProcessBackend;
    analytics: Analytics;
    notification: Notifier;
    recollection: Recollector;
    assistance: Assistance;

}

export default {
    auth : {} as Authenticator
    , backend : {} as Backend
    , serviceInProcess : {} as ServiceInProcessBackend
    , analytics: {} as Analytics
    , notification: {} as Notifier
    , recollection: {} as Recollector
    , assistance: {} as Assistance
} as Dependencies;

export function setUpDependencies(dependencies: Dependencies) {
    // initialize firebase
    const firebaseApp = initializeApp(firebaseConfig);
    dependencies.auth = new FirebaseAuthenticator(firebaseApp);
    // dependencies.auth = new GraphqlAuthenticator();
    // dependencies.backend = new FirestoreBackend(getFirestore(firebaseApp));
    dependencies.backend = new AmplifyBackend();
    dependencies.serviceInProcess = new ServiceInProcessApi();
    dependencies.analytics = new FirebaseAnalytics();
    return OpenaiAssistance.instantiate()
        .then(openaiAssistance => {
            dependencies.assistance = openaiAssistance;
        });
    
}