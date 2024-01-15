import { ChangedConduct, ConductFunctions, OrganizationFunctions } from "@/shared/service/domain/interfaces/backend";
import { CollectionType, ID, autoId } from ".";

import { collection, Firestore, where, query, FirestoreDataConverter, DocumentData, QueryDocumentSnapshot, SnapshotOptions, getDoc, getDocs, QuerySnapshot, Timestamp, addDoc, DocumentReference, setDoc, doc, onSnapshot, DocumentSnapshot, or, and } from "firebase/firestore";
import { OrganizationProperties } from "@/shared/service/domain/authentication/organization";
import { ConductProperties, ConductTypes } from "@/shared/service/domain/timeline/conduct";
import { Observable } from "rxjs";


interface FSConduct {
    type: string;
    from: ID;
    to?: ID | undefined;
    mention?: ID[] | undefined;
    text?: string | undefined;
    createdAt: Timestamp;
}

const conductConverter: FirestoreDataConverter<ConductProperties> = {
    toFirestore(modelObject: ConductProperties): DocumentData {
        return {
            type: modelObject.type
            , from: modelObject.from
            , to: modelObject.to ?? undefined
            , mention: modelObject.mention ?? undefined
            , text: modelObject.text ?? undefined
            , createdAt: Timestamp.fromDate(modelObject.createdAt)
        };
    }
    , fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>, options?: SnapshotOptions | undefined): ConductProperties => {
        const id  = snapshot.id;
        const data = snapshot.data(options) as FSConduct;
        
        return {
            id
            , type: ((type: string): ConductTypes => { 
                switch (type) {
                case ConductTypes.text: {
                    return ConductTypes.text;
                }
                default:
                    return ConductTypes.text; 
                }
            })(data.type)
            , from: data.from
            , to: data.to ?? null
            , mention: data.mention ?? null
            , text: data.text ?? null
            , createdAt: data.createdAt.toDate()
        };
    }
};

export function createConductFunctions(db: Firestore, unsubscribers: Array<() => void>): ConductFunctions {
    const conductCollectionRef = collection(db, CollectionType.conducts).withConverter(conductConverter);
    
    return {
        record: (userId: ID, to: ID | null, mention: ID[] | null, text: string): Promise<ConductProperties> => {
            const id = autoId();
            const conductProperties = {
                id
                , type: ConductTypes.text
                , from: userId
                , to
                , mention
                , text
                , createdAt: new Date()
            } as ConductProperties;
            return setDoc(doc(conductCollectionRef, id), conductProperties)
                .then(() => {
                    console.log("Document written with ID: ", id);
                    return conductProperties;
                });
        }
        , getObservable: (userId: ID, followeeIds: ID[], groupIds: ID[], isAdministrator: boolean): Observable<ChangedConduct[]> => {
            return new Observable(subscriber => {
                const myRoles = isAdministrator ? ["dummy"] : ["dummy"];
                const unsubscribe = onSnapshot(
                    query(
                        conductCollectionRef
                        , or (
                            where("from", "==", userId)                   // 自分のlog
                            // , and(                                        // フォローしている人のパブリックなlog
                            //     where("from", "in", followeeIds)
                            //     , where("isPublic", "==", true)
                            // )
                            , where("to", "in", groupIds.concat(myRoles)) // 所属グループ内のlog + 運営からのお知らせ
                        )
                    )
                    , (snapshot: QuerySnapshot<ConductProperties>)=> {
                        const changedItems = snapshot.docChanges()
                            .map(item => {
                                const id = item.doc.id;
                                const logProperties = item.doc.data();
                                return ChangedConduct[item.type]({ id, item: logProperties });
                            });
                        subscriber.next(changedItems);
                    });
                unsubscribers.push(unsubscribe);
            });
        }
         
    };
}
