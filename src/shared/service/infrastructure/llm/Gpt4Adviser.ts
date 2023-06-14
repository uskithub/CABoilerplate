import { Adviser } from "../../domain/interfaces/adviser";

import { OpenAI } from "langchain/llms/openai";
import { LLMChain, VectorDBQAChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import { PineconeClient } from "@pinecone-database/pinecone";
import { PineconeStore, VectorStore } from "langchain/vectorstores";
import { OpenAIEmbeddings } from "langchain/embeddings";


/**
 * @see: https://js.langchain.com/docs/modules/indexes/vector_stores/integrations/pinecone
 */
export class Gpt4Adviser implements Adviser {
    #llmChain: LLMChain;
    #vectorDBQAChain: VectorDBQAChain;

    constructor(vectorStore?: VectorStore) {
        const model = new OpenAI({ openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY, temperature: 0.9 });
        const prompt = new PromptTemplate({
            inputVariables: ["product"]
            , template: "一日の始めに3分くらいでできる、「これをやったら世界が確実に少し良くなる」という何かを一つ提案して下さい。"
        });

        this.#llmChain = new LLMChain({ llm: model, prompt });
        if (vectorStore !== undefined) {
            this.#vectorDBQAChain = VectorDBQAChain.fromLLM(model, vectorStore, {
                k: 1
                , returnSourceDocuments: true
            });
        }  
    }

    static instantiate(): Promise<Gpt4Adviser> {
        const client = new PineconeClient();
        return client.init({
            apiKey: import.meta.env.VITE_PINECONE_API_KEY as string
            , environment: import.meta.env.VITE_PINECONE_ENVIRONMENT as string
        })
            .then(() => {
                const pineconeIndex = client.Index(import.meta.env.VITE_PINECONE_INDEX as string);
                return PineconeStore.fromExistingIndex(
                    new OpenAIEmbeddings()
                    , { pineconeIndex }
                );
            })
            .then(store => {
                return new Gpt4Adviser(store);
            });
    }

    input(): Promise<void> {
        return Promise.resolve();
    }

    output(): Promise<string> {
        this.#vectorDBQAChain.call();
        return this.#llmChain.call({ 
            product: "家庭用ロボット" 
        }).then(chainValues => {
            console.log("chainValues", chainValues);
            return chainValues.text as string;
        });
    }
}