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

    setup(fromDocuments: string): Promise<void> {
        return PineconeStore.fromDocuments(fromDocuments, new OpenAIEmbeddings(), { 
            pineconeIndex: this.#index
        }).then(store => {
            return;
        });
    }

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