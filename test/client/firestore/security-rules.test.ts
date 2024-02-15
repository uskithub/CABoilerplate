import { expectFirestorePermissionDenied, expectFirestorePermissionUpdateSucceeds, getFirestoreCoverageMeta, expectPermissionGetSucceeds } from "./utils";

import { collection, connectFirestoreEmulator, doc, getDoc, getFirestore, setDoc } from "firebase/firestore";

import { initializeTestEnvironment, RulesTestEnvironment, assertSucceeds } from "@firebase/rules-unit-testing";
import { resolve } from "path";
import { createWriteStream, readFileSync } from "fs";
import { get } from "http";

import testData from "./test-data.json";
import { CollectionType } from "@client/service/infrastructure/firestoreBackend";

// firebaseと@firebase/rules-unit-testingの型定義が衝突しているため、型を再定義
type Firestore = firebase.default.firestore.Firestore;

/**
 * The emulator will accept any project ID for testing.
 */
const PROJECT_ID = "unit-testing";
const FIREBASE_JSON = resolve(__dirname, "../../../firebase.json");
let testEnv: RulesTestEnvironment;

async function importTestData(db: Firestore) {
    let summary: { [x:string]: number } = {};
    for (const [collectionName, documents] of Object.entries(testData)) {
        const collectionRef = collection(db, collectionName);
        summary[collectionName] = 0;
        for (const [documentId, documentData] of Object.entries(documents)) {
            await setDoc(doc(collectionRef, documentId), documentData);
            summary[collectionName] += 1;
        }
    }
    console.log('Data imported successfully:', summary);
}

beforeAll(async () => {
    const { host, port } = getFirestoreCoverageMeta(PROJECT_ID, FIREBASE_JSON);
    testEnv = await initializeTestEnvironment({
        projectId: PROJECT_ID,
        firestore: {
          port
          , host
          , rules: readFileSync("src/server/system/config/firebase/firestore.rules", "utf8")
        },
    });
});
  
beforeEach(async () => {
    // Clear the database between tests
    await testEnv.clearFirestore();
    await testEnv.withSecurityRulesDisabled(async context => {
        const noRuleDB = context.firestore();
        await importTestData(noRuleDB);
      });
});
  
afterAll(async () => {
    // Write the coverage report to a file
    const { coverageUrl } = getFirestoreCoverageMeta(PROJECT_ID, FIREBASE_JSON);
    const coverageFile = "./firestore-coverage.html";
    const fstream = createWriteStream(coverageFile);
    await new Promise((resolve, reject) => {
        get(coverageUrl, (res) => {
            res.pipe(fstream, { end: true });
            res.on("end", resolve);
            res.on("error", reject);
        });
    });
    console.log(`View firestore rule coverage information at ${ coverageFile }\n`);
});

describe(`${ CollectionType.users } collection`, () => {
    describe("list", () => {
        test("未認証ユーザが list できないこと", async () => {
            const db = testEnv.unauthenticatedContext().firestore();
            await expectFirestorePermissionDenied(db.collection(CollectionType.users).get());
        });

        test("認証済ユーザが list できないこと", async () => {
            const userId = "SoR4yFNnoCYelNVVr1S3YzcOYg22";
            const db = testEnv.authenticatedContext(userId).firestore();
            await expectFirestorePermissionDenied(db.collection(CollectionType.users).get());
        });
    });

    describe("get", () => {
        const userId = "SoR4yFNnoCYelNVVr1S3YzcOYg22";
        test("未認証ユーザが get できないこと", async () => {
            const db = testEnv.unauthenticatedContext().firestore();
            await expectFirestorePermissionDenied(db.collection(CollectionType.users).doc(userId).get());
        });

        test("認証済ユーザが get できること", async () => {
            const db = testEnv.authenticatedContext(userId).firestore();
            await expectPermissionGetSucceeds(db.collection(CollectionType.users).doc(userId).get());
        });
    });

    describe("create", () => {
        const userId = "not-exist-user-id";
        test("未認証ユーザが create できないこと", async () => {
            const db = testEnv.unauthenticatedContext().firestore();
            await expectFirestorePermissionDenied(
                db.collection(CollectionType.users)
                    .doc(userId)
                    .set({
                        displayName: "hogehogeさん"
                    })
            );
        });

        test("認証済ユーザが自分のuidをidに create できること", async () => {
            const db = testEnv.authenticatedContext(userId).firestore();
            await expectPermissionGetSucceeds(
                db.collection(CollectionType.users)
                    .doc(userId)
                    .set({
                        displayName: "hogehogeさん"
                    })
            );
        });

        test("認証済ユーザが自分のuid以外をidに create できないこと", async () => {
            const db = testEnv.authenticatedContext(userId).firestore();
            await expectFirestorePermissionDenied(
                db.collection(CollectionType.users)
                    .doc("not-exist-another-user-id")
                    .set({
                        displayName: "hogehogeさん"
                    })
            );
        });
    });

    describe("update", () => {
        const userId = "SoR4yFNnoCYelNVVr1S3YzcOYg22";
        const anotherUserId = "jELRVkFjOLb9l5zukRxlEMOfRsB3";
        test("未認証ユーザが update できないこと", async () => {
            const db = testEnv.unauthenticatedContext().firestore();
            await expectFirestorePermissionDenied(
                db.collection(CollectionType.users)
                    .doc(userId)
                    .update({
                        displayName: "hogehogeさん"
                    })
            );
        });

        test("認証済ユーザが自分のdocumentを update できること", async () => {
            const db = testEnv.authenticatedContext(userId).firestore();
            await expectPermissionGetSucceeds(
                db.collection(CollectionType.users)
                    .doc(userId)
                    .update({
                        displayName: "hogehogeさん"
                    })
            );
        });

        // 上とどちらか１つならテストが通るが、２つともにするといかがエラーとなる
        test("認証済ユーザが自分以外のdocumentを update できないこと", async () => {
            const db = testEnv.authenticatedContext(userId).firestore();
            await expectFirestorePermissionDenied(
                db.collection(CollectionType.users)
                    .doc(anotherUserId)
                    .update({
                        displayName: "hogehogeさん"
                    })
            );
        });
    });
});