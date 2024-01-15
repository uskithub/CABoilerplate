import { ChangedLog, LogFunctions, OrganizationFunctions } from "@/shared/service/domain/interfaces/backend";
import { CollectionType, ID, autoId } from ".";

import { collection, Firestore, where, query, FirestoreDataConverter, DocumentData, QueryDocumentSnapshot, SnapshotOptions, getDoc, getDocs, QuerySnapshot, Timestamp, addDoc, DocumentReference, setDoc, doc, onSnapshot, DocumentSnapshot, or, and, orderBy, limit } from "firebase/firestore";
import { OrganizationProperties } from "@/shared/service/domain/authentication/organization";
import { LogProperties, LogTypes } from "@/shared/service/domain/timeline/log";
import { Observable } from "rxjs";


interface FSLog {
    type: string;
    from: ID;
    to?: ID | undefined;
    mention?: ID[] | undefined;
    text?: string | undefined;
    createdAt: Timestamp;
}

const logConverter: FirestoreDataConverter<LogProperties> = {
    toFirestore(modelObject: LogProperties): DocumentData {
        return {
            type: modelObject.type
            , from: modelObject.from
            , to: modelObject.to ?? undefined
            , mention: modelObject.mention ?? undefined
            , text: modelObject.text ?? undefined
            , createdAt: Timestamp.fromDate(modelObject.createdAt)
        };
    }
    , fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>, options?: SnapshotOptions | undefined): LogProperties => {
        const id  = snapshot.id;
        const data = snapshot.data(options) as FSLog;
        
        return {
            id
            , type: ((type: string): LogTypes => { 
                switch (type) {
                case LogTypes.text: {
                    return LogTypes.text;
                }
                default:
                    return LogTypes.text; 
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

export function createLogFunctions(db: Firestore, unsubscribers: Array<() => void>): LogFunctions {
    const logCollectionRef = collection(db, CollectionType.logs).withConverter(logConverter);
    
    return {
        record: (userId: ID, to: ID | null, mention: ID[] | null, text: string): Promise<LogProperties> => {
            const id = autoId();
            const logProperties = {
                id
                , type: LogTypes.text
                , from: userId
                , to
                , mention
                , text
                , createdAt: new Date()
            } as LogProperties;
            return setDoc(doc(logCollectionRef, id), logProperties)
                .then(() => {
                    console.log("Document written with ID: ", id);
                    return logProperties;
                });
        }
        , getObservable: (userId: ID, followeeIds: ID[], groupIds: ID[], isAdministrator: boolean): Observable<ChangedLog[]> => {
            return new Observable(subscriber => {
                const myRoles = isAdministrator ? [] : [];
                const unsubscribe = onSnapshot(
                    query(
                        logCollectionRef
                        // 分離句: 1 + followeeIds.length + groupIds.length + 2 < 30 であること
                        , or (
                            where("from", "==", userId)                   // 自分のlog
                            , and(                                        // フォローしている人のlog
                                where("from", "in", followeeIds)
                                , where("isPublic", "==", true)
                            )
                            , where("to", "in", groupIds.concat(myRoles)) // 所属グループ内のlog + 運営からのお知らせ
                        )
                        , orderBy("createdAt", "desc")
                        , limit(25)
                    )
                    , (snapshot: QuerySnapshot<LogProperties>)=> {
                        const changedItems = snapshot.docChanges()
                            .map(item => {
                                const id = item.doc.id;
                                const logProperties = item.doc.data();
                                return ChangedLog[item.type]({ id, item: logProperties });
                            });
                        subscriber.next(changedItems);
                    });
                unsubscribers.push(unsubscribe);
            });
        }
         
    };
}
