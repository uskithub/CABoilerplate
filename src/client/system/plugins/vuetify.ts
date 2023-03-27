// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Vuetify
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi-svg"
import { fa } from "vuetify/iconsets/fa-svg"
import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import { far } from "@fortawesome/free-regular-svg-icons";
// import { fas } from "@fortawesome/free-solid-svg-icons"

import { App } from "vue";

export function loadVuetify(app: App<Element>) {

  app.component('font-awesome-icon', FontAwesomeIcon) // Register component globally
  library.add(far) // Include needed icons
  // library.add(fas) // Include needed icons

  const vuetify = createVuetify(
    // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
    {
      components,
      directives,
      icons: {
        defaultSet: "mdi",
        aliases,
        sets: {
          mdi,
          fa,
        }
      },
    }
  );

  app.use(vuetify);
}


