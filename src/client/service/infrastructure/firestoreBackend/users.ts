import { UserFunctions } from "@/shared/service/domain/interfaces/backend";
import { addDoc, collection, collectionGroup, doc, DocumentChangeType, Firestore, getDocs, onSnapshot, orderBy, where, query, DocumentSnapshot, DocumentData, Unsubscribe, Timestamp, setDoc, FirestoreError, FirestoreDataConverter, PartialWithFieldValue, QueryDocumentSnapshot, SetOptions, SnapshotOptions, WithFieldValue } from "firebase/firestore";
import { CollectionType, MAX_ID } from "./firestoreBackend";
import { Account, OrganizationAndRole, RoleType, UserProperties } from "@/shared/service/domain/authentication/user";
import { Observable } from "rxjs";

interface FSUser {
    displayName: string;
    email: string;
    photoURL: string;
    companions: Array<string>;
    // notifications: [FSNotificaiton]|null;
    // doing: { task: FSTask; log: FSLog };
    organizationAndRoles: Array<string>;
    createdAt: Timestamp;
}

const userConverter: FirestoreDataConverter<UserProperties> = {
    toFirestore(modelObject: UserProperties): DocumentData {
        const encodeOrganizationAndRole = (organizaiotnAndRole: OrganizationAndRole): string => {
            switch(organizaiotnAndRole.role) {
            case RoleType.owner: {
                return `${organizaiotnAndRole.organizationId}O`;
            }
            case RoleType.administrator: {
                return `${organizaiotnAndRole.organizationId}A`;
            }
            case RoleType.member: {
                return `${organizaiotnAndRole.organizationId}M`;
            }
            case RoleType.collaborator: {
                return `${organizaiotnAndRole.organizationId}C`;
            }
            }
        };
        return {
            email: modelObject.email
            , photoUrl: modelObject.photoUrl
            , displayName: modelObject.displayName
            , isEmailVerified: modelObject.isEmailVerified
            , organizationAndRoles: modelObject.organizationAndRoles.map(item => encodeOrganizationAndRole(item))
            , createdAt: Timestamp.fromDate(modelObject.createdAt)
        };
    }
    , fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>, options?: SnapshotOptions | undefined): UserProperties => {
        const id  = snapshot.id;
        const data = snapshot.data(options) as FSUser;
        const decodeOrganizationAndRole = (organizaiotnAndRole: string): OrganizationAndRole => {
            switch(organizaiotnAndRole.slice(MAX_ID.length)) {
            case "O": {
                return {
                    organizationId: organizaiotnAndRole.slice(-1 * MAX_ID.length, -1)
                    , role: RoleType.owner
                };
            }
            case "A": {
                return {
                    organizationId: organizaiotnAndRole.slice(-1 * MAX_ID.length, -1)
                    , role: RoleType.administrator
                };
            }
            case "M": {
                return {
                    organizationId: organizaiotnAndRole.slice(-1 * MAX_ID.length, -1)
                    , role: RoleType.member
                };
            }
            case "C": {
                return {
                    organizationId: organizaiotnAndRole.slice(-1 * MAX_ID.length, -1)
                    , role: RoleType.collaborator
                };
            }
            default: {
                throw new Error();
            }
            }
        };
        return {
            id
            , email: data.email
            , photoUrl: data.photoURL
            , displayName: data.displayName
            , isEmailVerified: true
            // , notifications: user.notifications
            // , doing: user.doing
            , organizationAndRoles: data.organizationAndRoles.map(item => decodeOrganizationAndRole(item))
            , createdAt: data.createdAt.toDate()
        };
    }
};

export function createUserFunctions(db: Firestore): UserFunctions {
    const userCollectionRef = collection(db, CollectionType.users).withConverter(userConverter);
    const unsubscribes: Unsubscribe[] = [];
    return {
        getObservable: (userId: string): Observable<UserProperties | null> => {
            return new Observable(subscriber => {
                const unsubscribe = onSnapshot(
                    doc(userCollectionRef, userId)
                    , (snapshot: DocumentSnapshot<UserProperties>)=> {
                        if (snapshot.exists()) {
                            subscriber.next(snapshot.data());       
                        } else {
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
                    , (snapshot: DocumentSnapshot<UserProperties>) => {
                        if (snapshot.exists()) {
                            resolve(snapshot.data());
                        } else {
                            resolve(null);
                        }
                    });
                unsubscribes.push(unsubscribe);
            });
        }
        , create: (account: Account, organizationAndRole?: OrganizationAndRole | undefined): Promise<UserProperties> => {
            const userProperties = {
                id: account.id
                , email: account.email
                , photoUrl: account.photoUrl
                , displayName: account.displayName
                , isEmailVerified: account.isEmailVerified
                // , domain: account.email ? account.email.split("@")[1] : null
                , organizationAndRoles: (organizationAndRole ? [organizationAndRole] : [])
                , createdAt: new Date()
            } as UserProperties;
            return setDoc(doc(userCollectionRef, account.id), userProperties)
                .then(() => {
                    console.log("Document written with ID: ", account.id);
                    return userProperties;
                });
        }
    };
}