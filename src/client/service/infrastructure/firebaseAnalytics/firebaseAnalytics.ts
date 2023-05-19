import { LogProperties } from "@/shared/service/domain/analytics/log";
import { Analytics } from "@/shared/service/domain/interfaces/analytics";
import { getAnalytics, logEvent } from "firebase/analytics";
import type { Analytics as FAnalytics } from "firebase/analytics";

export class FirebaseAnalytics implements Analytics {
    analytics: FAnalytics;

    constructor() {
        this.analytics = getAnalytics();
    }
    
    logEvent(properties: LogProperties) {
        // logEvent(this.analytics, properties.event, properties.params);
        console.log("FAnalytices.logEvent", properties);
    }
}