import { PineconeClient } from "@pinecone-database/pinecone";
import { Recollector } from "../../domain/interfaces/recollection";
import { VectorOperationsApi } from "@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { PineconeStore } from "langchain/vectorstores";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export class PineconeRecollector implements Recollector {
    #client: PineconeClient;
    #index: VectorOperationsApi;

    private constructor(client: PineconeClient, index: VectorOperationsApi) {
        this.#client = client;
        this.#index = index;
    }

    static instantiate(): Promise<PineconeRecollector> {
        const client = new PineconeClient();
        return client.init({
            apiKey: import.meta.env.VITE_PINECONE_API_KEY as string
            , environment: import.meta.env.VITE_PINECONE_ENVIRONMENT as string
        })
            .then(() => {
                const index = client.Index(import.meta.env.VITE_PINECONE_INDEX as string);
                const self = new PineconeRecollector(client, index);
                return self;
            });
    }

    /**
     * 初期データとともにVectorStoreを新規作成する。
     * @param text 
     * @returns 
     */
    setup(text: string): Promise<void> {
        const docs = [
            new Document({
                metadata: { foo: "bar" }
                , pageContent: "pinecone is a vector db"
            })
            , new Document({
                metadata: { foo: "bar" }
                , pageContent: "the quick brown fox jumped over the lazy dog"
            })
            , new Document({
                metadata: { baz: "qux" }
                , pageContent: "lorem ipsum dolor sit amet"
            })
            , new Document({
                metadata: { baz: "qux" }
                , pageContent: "pinecones are the woody fruiting body and of a pine tree"
            })
        ];
        const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
        return textSplitter.createDocuments([text])
            .then(docs => {
                return PineconeStore.fromDocuments(docs, new OpenAIEmbeddings(), { 
                    pineconeIndex: this.#index
                }).then(store => {
                    return;
                });
            });
    }

    /**
     * 既存のVectorStoreにデータを追加する。
     * @param text 
     * @returns 
     */
    larn(text: string): Promise<void> {
        const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
        return textSplitter.createDocuments([text])
            .then(docs => {
                return PineconeStore.fromExistingIndex(
                    new OpenAIEmbeddings()
                    , { pineconeIndex: this.#index}
                )
                    .then(store => {
                        return store.addDocuments(docs);
                    });
            });
        
    }
}