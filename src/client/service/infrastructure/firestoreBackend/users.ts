import { UserFunctions } from "@/shared/service/domain/interfaces/backend";
import { addDoc, collection, collectionGroup, doc, DocumentChangeType, Firestore, getDocs, onSnapshot, orderBy, where, query, DocumentSnapshot, DocumentData, Unsubscribe, Timestamp, setDoc, FirestoreError } from "firebase/firestore";
import { CollectionType } from "./firestoreBackend";
import { Account, UserProperties } from "@/shared/service/domain/authentication/user";
import { Observable } from "rxjs";
import { resolve } from "path";
import { rejects } from "assert";

export interface FSUser {
    displayName: string;
    email: string;
    photoURL: string;
    companions: Array<string>;
    // notifications: [FSNotificaiton]|null;
    // doing: { task: FSTask; log: FSLog };
    createdAt: Timestamp;
}
// TODO: この辺の修正から
function convert(id: string, user: FSUser): UserProperties {
    return {
        id
        , mailAddress: user.email
        , photoUrl: user.photoURL
        , displayName: user.displayName
        , isMailAddressVerified: user.VER
        // , notifications: user.notifications
        // , doing: user.doing
        , createdAt: user.createdAt
    };
}

export function createUserFunctions(db: Firestore): UserFunctions {
    const userCollectionRef = collection(db, CollectionType.users);
    const unsubscribes: Unsubscribe[] = [];

    return {
        getObservable: (userId: string): Observable<UserProperties | null> => {
            return new Observable(subscriber => {
                const unsubscribe = onSnapshot(
                    doc(userCollectionRef, userId)
                    , (snapshot: DocumentSnapshot<DocumentData>)=> {
                        if (snapshot.exists()) {
                            const userData = snapshot.data() as FSUser;
                            const userProperties = convert(snapshot.id, userData);
                            subscriber.next(userProperties);       
                        } else {
                            unsubscribe();
                            subscriber.next(null);       
                        }
                    }
                    , (error: FirestoreError) => {
                        // TODO: ログアウトすると「Missing or insufficient permissions.」が発生する。
                        subscriber.error(error);
                    });
                unsubscribes.push(unsubscribe);
            });
        }
        , get: (userId: string): Promise<UserProperties | null> => {
            return new Promise<UserProperties | null>((resolve, reject) => {
                const unsubscribe = onSnapshot(
                    doc(userCollectionRef, userId)
                    , (snapshot: DocumentSnapshot<DocumentData>) => {
                        if (snapshot.exists()) {
                            const userData = { id: snapshot.id, ...snapshot.data() } as FSUser;
                            resolve(null);
                        } else {
                            resolve(null);
                        }
                    });
                unsubscribes.push(unsubscribe);
            });
        }
        , create: (user: Account): Promise<UserProperties> => {

            return setDoc(doc(userCollectionRef, user.id), {
                displayName: user.displayName
                , email: user.mailAddress
                , photoURL: user.photoUrl
                , companions: []
                , createdAt: Timestamp.now()
            })
                .then(() => {
                    console.log("Document written with ID: ", user.id);
                    return user;
                });
        }
    };
}