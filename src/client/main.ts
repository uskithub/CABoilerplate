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

import { DICTIONARY_KEY, i18n } from "@/shared/system/localizations";
import { FirebaseAnalytics } from "./service/infrastructure/firebaseAnalytics/firebaseAnalytics";
import { DISPATCHER_KEY, createDispatcher } from "./service/application/performers";
import { SignInStatus } from "@/shared/service/domain/interfaces/authenticator";
import { U } from "@/shared/service/application/usecases";
import { Subscription } from "rxjs";
import { Nobody } from "@/shared/service/application/actors/nobody";
import { FirebasePresence } from "./service/infrastructure/firebasePresence";
import { Service } from "@/shared/service/application/actors/service";
import { UserProperties } from "@/shared/service/domain/authentication/user";

export const dictionary = i18n(navigator.language);

// initialize firebase
const firebaseApp = initializeApp(firebaseConfig);
dependencies.auth = new FirebaseAuthenticator(firebaseApp);
dependencies.presence = new FirebasePresence(firebaseApp);
dependencies.backend = new FirestoreBackend(getFirestore(firebaseApp));
dependencies.analytics = new FirebaseAnalytics();

loadFonts();

const app = createApp(App);

const router = loadRouter(app);
loadVuetify(app);

router
    .isReady() // 直リン対策で初めのPathを取得するために待つ
    .finally(() => {
        const dispatcher = createDispatcher(router);
        const { stores, dispatch } = dispatcher;
        app.provide(DISPATCHER_KEY, dispatcher);
        app.provide(DICTIONARY_KEY, dictionary);

        let subscriptions: Subscription[] = [];
        watch(() => stores.shared.signInStatus, (newValue) => {
            if (newValue.case === SignInStatus.signIn) {
                const userProperties = newValue.userProperties as unknown as UserProperties;
                const serviceActor = new Service();
                // dispatch(U.projectManagement.observingUsersTasks.basics[Service.usecases.observingUsersTasks.basics.serviceDetectsSigningIn]({ user }), serviceActor)
                //     .then(subscription => {
                //         if (subscription) subscriptions.push(subscription);
                //     })
                //     .catch(e => console.error(e));
        
                // dispatch(U.projectManagement.observingUsersProjects.basics[Service.usecases.observingUsersProjects.basics.serviceDetectsSigningIn]({ user }), serviceActor)
                //     .then(subscription => {
                //         if (subscription) subscriptions.push(subscription);
                //     })
                //     .catch(e => console.error(e));
                
                dispatch(U.timeline.observingUsersTimeline.basics[Service.usecases.observingUsersTimeline.basics.serviceDetectsSigningIn]({ user: userProperties }), serviceActor)
                    .then(subscription => {
                        if (subscription) subscriptions.push(subscription);
                    })
                    .catch(e => console.error(e));
            } else if (newValue.case === SignInStatus.signingOut) {
                subscriptions.forEach((s) => s.unsubscribe());
                subscriptions = [];
            }
        });

        if (stores.shared.signInStatus.case === SignInStatus.unknown) {
            dispatch(U.application.boot.basics[Nobody.usecases.boot.basics.userOpensSite]())
                .catch(e => console.error(e));
        }

        app.mount("#app");
    });