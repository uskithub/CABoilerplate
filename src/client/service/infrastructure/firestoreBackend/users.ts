import { UserFunctions } from "@/shared/service/domain/interfaces/backend";
import { collection, doc, Firestore, getDocs, onSnapshot, where, query, DocumentSnapshot, DocumentData, Unsubscribe, Timestamp, setDoc, FirestoreError, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore";
import { CollectionType, ID, MAX_ID } from ".";
import { Account, OrganizationAndRole, RoleType, UserProperties } from "@/shared/service/domain/authentication/user";
import { Observable } from "rxjs";

interface FSUser {
    id: ID;  // where("id", "in", ["xxx", "yyy"]) で検索できるようにするためにフィールドにも持たせる
    displayName: string;
    email: string;
    photoUrl: string;
    companions: Array<string>;
    // notifications: [FSNotificaiton]|null;
    // doing: { task: FSTask; log: FSLog };
    organizationAndRoles?: Array<string> | undefined;
    createdAt: Timestamp;
}

const userConverter: FirestoreDataConverter<UserProperties> = {
    toFirestore(modelObject: UserProperties): DocumentData {
        const encodeOrganizationAndRole = (organizationAndRole: OrganizationAndRole): string => {
            switch(organizationAndRole.role) {
            case RoleType.owner: {
                return `${organizationAndRole.organizationId}O`;
            }
            case RoleType.administrator: {
                return `${organizationAndRole.organizationId}A`;
            }
            case RoleType.member: {
                return `${organizationAndRole.organizationId}M`;
            }
            case RoleType.collaborator: {
                return `${organizationAndRole.organizationId}C`;
            }
            }
        };
        return {
            id: modelObject.id
            , email: modelObject.email
            , photoUrl: modelObject.photoUrl
            , displayName: modelObject.displayName
            , isEmailVerified: modelObject.isEmailVerified
            , organizationAndRoles: modelObject.organizationAndRoles?.map(item => encodeOrganizationAndRole(item))
            , createdAt: Timestamp.fromDate(modelObject.createdAt)
        };
    }
    , fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>, options?: SnapshotOptions | undefined): UserProperties => {
        const id  = snapshot.id;
        const data = snapshot.data(options) as FSUser;
        const decodeOrganizationAndRole = (organizationAndRole: string): OrganizationAndRole => {
            switch(organizationAndRole.slice(MAX_ID.length)) {
            case "O": {
                return {
                    organizationId: organizationAndRole.slice(0, MAX_ID.length)
                    , name: null
                    , role: RoleType.owner
                };
            }
            case "A": {
                return {
                    organizationId: organizationAndRole.slice(0, MAX_ID.length)
                    , name: null
                    , role: RoleType.administrator
                };
            }
            case "M": {
                return {
                    organizationId: organizationAndRole.slice(0, MAX_ID.length)
                    , name: null
                    , role: RoleType.member
                };
            }
            case "C": {
                return {
                    organizationId: organizationAndRole.slice(0, MAX_ID.length)
                    , name: null
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
            , photoUrl: data.photoUrl
            , displayName: data.displayName
            , isEmailVerified: true
            // , notifications: user.notifications
            // , doing: user.doing
            , organizationAndRoles: data.organizationAndRoles?.map(item => decodeOrganizationAndRole(item)) ?? []
            , createdAt: data.createdAt.toDate()
        };
    }
};

export function createUserFunctions(db: Firestore): UserFunctions {
    const userCollectionRef = collection(db, CollectionType.users).withConverter(userConverter);
    const organizationCollectionRef = collection(db, CollectionType.organizations);

    const unsubscribes: Unsubscribe[] = [];

    const getOrganizationName = (organizationAndRoles: OrganizationAndRole[]): Promise<OrganizationAndRole[]> => {
        return getDocs(
            query(
                organizationCollectionRef
                , where("id", "in", organizationAndRoles.map(i => i.organizationId))
            )
        ).then((querySnapshot) => {
            if (querySnapshot.empty) {
                return organizationAndRoles;
            } else {
                return organizationAndRoles.map(i => {
                    const data = querySnapshot.docs.find(doc => doc.id == i.organizationId)?.data();
                    i.name = (data?.name ?? data?.domain) as string | null;
                    return i;
                });
            }
        });
    };
    
    return {
        getObservable: (userId: string): Observable<UserProperties | null> => {
            return new Observable(subscriber => {
                const unsubscribe = onSnapshot(
                    doc(userCollectionRef, userId)
                    , (snapshot: DocumentSnapshot<UserProperties>)=> {
                        if (snapshot.exists()) {
                            const userProperties = snapshot.data();
                            if (userProperties.organizationAndRoles.length > 0) {
                                getOrganizationName(userProperties.organizationAndRoles)
                                    .then(organizationAndRoles => {
                                        userProperties.organizationAndRoles = organizationAndRoles;
                                        subscriber.next(userProperties);
                                    })
                                    .catch(error => {
                                        subscriber.error(error);
                                    });
                            } else {
                                subscriber.next(userProperties);
                            }
                        } else {
                            subscriber.next(null);       
                        }
                    }
                    , (error: FirestoreError) => {
                        // TODO: ログアウトすると「Missing or insufficient permissions.」が発生する。
                        subscriber.error(error);
                    });
                unsubscribes.push(unsubscribe);
                return () => unsubscribe();
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