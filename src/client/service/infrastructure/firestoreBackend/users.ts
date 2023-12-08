import { UserFunctions } from "@/shared/service/domain/interfaces/backend";
import { addDoc, collection, collectionGroup, doc, DocumentChangeType, Firestore, getDocs, onSnapshot, orderBy, where, query, DocumentSnapshot, DocumentData, Unsubscribe, Timestamp, setDoc } from "firebase/firestore";
import { CollectionType } from "./firestoreBackend";
import { UserProperties } from "@/shared/service/domain/authentication/user";

export interface FSUser {
    uid: string;
    displayName: string;
    email: string;
    photoURL: string;
    companions: Array<string>;
    // notifications: [FSNotificaiton]|null;
    // doing: { task: FSTask; log: FSLog };
    createdAt: Timestamp;
}

export function createUserFunctions(db: Firestore): UserFunctions {
    const userCollectionRef = collection(db, CollectionType.users);
    return {
        get: (userId: string): Promise<UserProperties | null> => {
            return new Promise<UserProperties | null>((resolve, reject) => {
                const unsubscribe = onSnapshot(
                    doc(userCollectionRef, userId)
                    , (snapshot: DocumentSnapshot<DocumentData>) => {
                        if (snapshot.exists()) {
                            const _user = snapshot.data() as FSUser;
                            resolve(null);
                        } else {
                            resolve(null);
                        }
                        unsubscribe();
                    });
            });
        }
        , create: (user: UserProperties): Promise<UserProperties> => {

            return setDoc(doc(userCollectionRef, user.uid), {
                uid: user.uid
                , displayName: user.displayName
                , email: user.mailAddress
                , photoURL: user.photoUrl
                , companions: []
                , createdAt: Timestamp.now()
            })
                .then(() => {
                    console.log("Document written with ID: ", user.uid);
                    return user;
                });
        }
    };
}