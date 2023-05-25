import { Recollector } from "@/shared/service/domain/interfaces/recollection";
import { PineconeClient } from "@pinecone-database/pinecone";

export class PineconeRecollector implements Recollector {
    #client: PineconeClient;
    constructor() {
        this.#client = new PineconeClient();
    }

    init(): Promise<void> {
        return this.#client.init({
            environment: ""
            , apiKey: ""
        });
    }
    
    larn(): Promise<void> {
        return PineconeStore.fromDocuments(documents, new OpenAIEmbeddings(), {
            pineconeIndex
        });
    }
}