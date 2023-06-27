
import { Consult } from "./shared/service/application/usecases/signedInUser/consult";
import { inject } from "vue";
import { DISPATCHER_KEY, Dispatcher, createDispatcher } from "./client/service/application/performers";
import { MessageProperties, Role } from "./shared/service/domain/chat/message";
import { Boot } from "./shared/service/application/usecases/nobody/boot";
import { FirebaseAuthenticator } from "./client/service/infrastructure/firebaseAuthenticator";
import dependencies from "@shared/service/domain/dependencies";
import { AmplifyBackend } from "./client/service/infrastructure/amplifyBackend";
import { ServiceInProcessApi } from "./client/service/infrastructure/amplify/serviceInProcessApi";
import { FirebaseAnalytics } from "./client/service/infrastructure/firebaseAnalytics/firebaseAnalytics";
import { OpenaiAssistance } from "@/shared/service/infrastructure/openai/openaiAssistance";
import { initializeApp } from "firebase/app";
import firebaseConfig from "@client/system/config/firebase.config.json";

console.log("========== Hello, world! ==========");

// initialize firebase
const firebaseApp = initializeApp(firebaseConfig);
dependencies.auth = new FirebaseAuthenticator(firebaseApp);
// dependencies.auth = new GraphqlAuthenticator();
// dependencies.backend = new FirestoreBackend(getFirestore(firebaseApp));
// dependencies.backend = new AmplifyBackend();
dependencies.serviceInProcess = new ServiceInProcessApi();
dependencies.analytics = new FirebaseAnalytics();
// OpenaiAssistance.instantiate().then(assistance => {
//     dependencies.assistance = assistance;
// });

const dispatcher = createDispatcher();
const { stores, dispatch } = dispatcher;

const message = {
    role: Role.user
    , content: "日本人で金メダルを取った人は誰？日本語で答えて。"
} as MessageProperties;

// dispatch({ scene: Consult.userInputsQuery, messages: [message] });
dispatch({ scene: Boot.userOpensSite });
