import { UserFunctions } from "@/shared/service/domain/interfaces/backend";
import { addDoc, collection, collectionGroup, doc, DocumentChangeType, Firestore, getDocs, onSnapshot, orderBy, where, query, DocumentSnapshot, DocumentData, Unsubscribe } from "firebase/firestore";
import { CollectionType } from "./firestoreBackend";

export function createUserFunctions(db: Firestore): UserFunctions {
    return {
        get: (userId: string): Promise<User | null> => {
            const userCollectionRef = collection(db, CollectionType.users);
            return new Promise<void>((resolve, reject) => {
                const unsubscribe = onSnapshot(
                    doc(userCollectionRef, userId)
                    , (snapshot: DocumentSnapshot<DocumentData>) => {
                        if (snapshot.exists()) {
                            const _userData = snapshot.data() as FSUser;
                            resolve();
                        } else {
                            reject();
                        }
                        unsubscribe();
                    });
            });
        }
    };
}