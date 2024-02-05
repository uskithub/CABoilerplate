import { OrganizationFunctions } from "@/shared/service/domain/interfaces/backend";
import { CollectionType, ID, autoId } from ".";

import { collection, Firestore, where, query, FirestoreDataConverter, DocumentData, QueryDocumentSnapshot, SnapshotOptions, getDoc, getDocs, QuerySnapshot, Timestamp, addDoc, DocumentReference, setDoc, doc } from "firebase/firestore";
import { OrganizationProperties } from "@/shared/service/domain/authentication/organization";


interface FSOrganization {
    id: ID; // where("id", "in", ["xxx", "yyy"]) で検索できるようにするためにフィールドにも持たせる
    domain: string;
    ownerIds: ID[];
    administratorIds: ID[];
    memberIds: ID[];
    collaboratorIds: ID[];
    createdAt: Timestamp;
}

const organizationConverter: FirestoreDataConverter<OrganizationProperties> = {
    toFirestore(modelObject: OrganizationProperties): DocumentData {
        return {
            id: modelObject.id
            , domain: modelObject.domain
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
    const organizationCollectionRef = collection(db, CollectionType.organizations).withConverter(organizationConverter);
    
    return {
        get: (domain: string): Promise<OrganizationProperties | null> => {
            return getDocs(
                query(
                    organizationCollectionRef
                    , where("domain", "==", domain)
                )
            ).then(querySnapshot => {
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
            const id = autoId();
            const organizationProperties = {
                id
                , domain
                , ownerIds: [ownerId]
                , administratorIds: new Array<string>()
                , memberIds: new Array<string>()
                , collaboratorIds: new Array<string>()
                , createdAt: new Date()
            } as OrganizationProperties;
            return setDoc(doc(organizationCollectionRef, id), organizationProperties)
                .then(() => {
                    console.log("Document written with ID: ", id);
                    return organizationProperties;
                });
        }
    };
}
