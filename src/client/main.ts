// system
import { createApp } from "vue";
import { loadRouter } from "@client/system/plugins/router";
import { loadVuetify } from "@client/system/plugins/vuetify";
import { loadFonts } from "@client/system/plugins/webfontloader";

import App from "./App.vue";
import dependencies, { setUpDependencies } from "@shared/service/domain/dependencies";

// Amplify
import { Amplify } from "aws-amplify";
import awsExports from "@client/system/config/aws-exports";

import { DICTIONARY_KEY, i18n } from "@/shared/system/localizations";

setUpDependencies(dependencies);

// initialize Amplify
Amplify.configure(awsExports);

loadFonts();

const dictionary = i18n(navigator.language);

const app = createApp(App);

loadRouter(app);
loadVuetify(app);

app.mount("#app");
app.provide(DICTIONARY_KEY, dictionary);

