import { ChangedTask, OrganizationFunctions } from "@/shared/service/domain/interfaces/backend";
import { convert, convertLog, FSLog, FSTask, LayerStatusTypeValues } from "./entities/tasks";
import { CollectionType } from "./firestoreBackend";

import { collection, Firestore, onSnapshot, where, query, FirestoreDataConverter, DocumentData, QueryDocumentSnapshot, SnapshotOptions, getDoc, getDocs, QuerySnapshot, Timestamp, addDoc, DocumentReference } from "firebase/firestore";
import { OrganizationProperties } from "@/shared/service/domain/authentication/organization";

interface FSOrganization {
    domain: string;
    ownerIds: string[];
    administratorIds: string[];
    memberIds: string[];
    collaboratorIds: string[];
    createdAt: Timestamp;
}

const userConverter: FirestoreDataConverter<OrganizationProperties> = {
    toFirestore(modelObject: OrganizationProperties): DocumentData {
        return {
            domain: modelObject.domain
            , ownerIds: modelObject.ownerIds
            , administratorIds: modelObject.administratorIds
            , memberIds: modelObject.memberIds
            , collaboratorIds: modelObject.collaboratorIds
            , createdAt: Timestamp.fromDate(modelObject.createdAt)
        };
    }
    , fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>, options?: SnapshotOptions | undefined): OrganizationProperties => {
        const id  = snapshot.id;
        const data = snapshot.data(options) as FSOrganization;
        return {
            id
            , domain: data.domain
            , ownerIds: data.ownerIds
            , administratorIds: data.administratorIds
            , memberIds: data.memberIds
            , collaboratorIds: data.collaboratorIds
            , createdAt: data.createdAt.toDate()
        };
    }
};

export function createOrganizationFunctions(db: Firestore): OrganizationFunctions {
    const organizationCollectionRef = collection(db, CollectionType.organizations).withConverter(userConverter);
    
    return {
        get: (domain: string): Promise<OrganizationProperties | null> => {
            return getDocs(
                query(
                    organizationCollectionRef
                    , where("domain", "==", domain)
                )
            ).then((querySnapshot) => {
                if (querySnapshot.empty) {
                    return null;
                } else {
                    const org = querySnapshot.docs.at(0);
                    if (org) {
                        return org.data();
                    } else {
                        return null;
                    }
                }
            });
        }
        , create: (domain: string, ownerId: string): Promise<OrganizationProperties> => {
            const organizationProperties = {
                domain
                , ownerIds: [ownerId]
                , administratorIds: new Array<string>()
                , memberIds: new Array<string>()
                , collaboratorIds: new Array<string>()
                , createdAt: new Date()
            } as OrganizationProperties;
            return addDoc(organizationCollectionRef, organizationProperties)
                .then((docRef: DocumentReference<OrganizationProperties>) => {
                    console.log("Document written with ID: ", docRef.id);
                    organizationProperties.id = docRef.id;
                    return organizationProperties;
                });
        }
    };
}
