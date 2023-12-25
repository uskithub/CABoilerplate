import { Presence } from "@/shared/service/domain/interfaces/presence";
import { error } from "console";
import { FirebaseApp } from "firebase/app";
import { Database, DatabaseReference, Unsubscribe, getDatabase, onDisconnect, onValue, push, ref, serverTimestamp, set } from "firebase/database";

export class FirebasePresence implements Presence {
    #db: Database;
    #connectedRef: DatabaseReference;

    constructor(app: FirebaseApp) {
        this.#db = getDatabase(app);
        this.#connectedRef = ref(this.#db, ".info/connected");
    }

    startsNotifying(userId: string) {
        const statusRef = ref(this.#db, "/presence/" + userId);
        
        const unsubscribe: Unsubscribe = onValue(this.#connectedRef, (snapshot) => {
            if (snapshot.val() === true) {

                // When I disconnect, remove this device
                onDisconnect(statusRef)
                    .set({
                        is_online: false
                        , last_changed: serverTimestamp()
                    })
                    .then(() => {
                        // Add this device to my connections list
                        // this value could contain info about the device or a timestamp too
                        return set(statusRef, {
                            is_online: true
                            , last_changed: serverTimestamp()
                        });
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }
        });
    }
}