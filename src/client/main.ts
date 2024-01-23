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
import { SERVICE_KEY, Mutable, SharedStore, createService } from "./service/application/performers";
import { SignInStatus } from "@/shared/service/domain/interfaces/authenticator";
import { R } from "@/shared/service/application/usecases";
import { Subscription } from "rxjs";
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
        const initialPath = router.currentRoute.value.path;
        const service = createService(initialPath);
        const { stores, dispatch } = service;
        app.provide(SERVICE_KEY, service);
        app.provide(DICTIONARY_KEY, dictionary);

        /* Setup for Routing */
        watch(() => stores.shared.currentRouteLocation, (newValue, oldValue) => {
            console.info("★☆★☆★ RouteLocation:", oldValue, "--->", newValue);
            router.replace(newValue)
                .finally(() => {
                    const _shared = stores.shared as Mutable<SharedStore>;
                    _shared.isLoading = false;
                });
        });
    
        // @see: https://router.vuejs.org/guide/advanced/navigation-guards.html#Navigation-Guards
        router.beforeEach((to, from) => {
            if (stores.shared.currentRouteLocation !== to.path && stores.shared.currentRouteLocation === from.path) {
                console.warn("!!!!! RouteLocation was changed directly by the user, e.g. from the address bar.", from.path, "--->", to.path);
                service.routingTo(to.path);
                return false;
            }
            return true;
        });

        let subscriptions: Subscription[] = [];
        watch(() => stores.shared.signInStatus, (newValue) => {
            if (newValue.case === SignInStatus.signIn) {
                const userProperties = newValue.userProperties as unknown as UserProperties;
                const serviceActor = new Service();
                // dispatch(R.projectManagement.observingUsersTasks.basics[Service.usecases.observingUsersTasks.basics.serviceDetectsSigningIn]({ user }), serviceActor)
                //     .then(subscription => {
                //         if (subscription) subscriptions.push(subscription);
                //     })
                //     .catch(e => console.error(e));
        
                // dispatch(R.projectManagement.observingUsersProjects.basics[Service.usecases.observingUsersProjects.basics.serviceDetectsSigningIn]({ user }), serviceActor)
                //     .then(subscription => {
                //         if (subscription) subscriptions.push(subscription);
                //     })
                //     .catch(e => console.error(e));
                
                dispatch(R.timeline.observingUsersTimeline.basics.serviceDetectsSigningIn({ user: userProperties }), serviceActor)
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
            dispatch(R.application.boot.basics.userOpensSite())
                .catch(e => console.error(e));
        }

        app.mount("#app");
    });