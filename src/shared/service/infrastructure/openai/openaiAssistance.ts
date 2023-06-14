import { Configuration, OpenAIApi } from "openai";
import { MessageProperties } from "../../domain/chat/message";
import { Assistance } from "../../domain/interfaces/assistance";

import { Observable, from } from "rxjs";
import { PineconeClient } from "@pinecone-database/pinecone";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY as string;
const PINECONE_API_KEY = import.meta.env.VITE_PINECONE_API_KEY as string;
const PINECONE_ENVIRONMENT = import.meta.env.VITE_PINECONE_ENVIRONMENT as string;
const PINECONE_INDEX = import.meta.env.VITE_PINECONE_INDEX as string;

const SYSTEM_PROMPT = "Use the below articles on the 2022 Winter Olympics to answer the subsequent question. If the answer cannot be found in the articles, write 'I could not find an answer'.";

export class OpenaiAssistance implements Assistance {
    #openai: OpenAIApi;
    #pineconeClient: PineconeClient;

    static instantiate(): Promise<OpenaiAssistance> {
        const self = new OpenaiAssistance();
        return self.init().then(() => self);
    }

    private constructor() {
        const configuration = new Configuration({
            apiKey: OPENAI_API_KEY
        });
        this.#openai = new OpenAIApi(configuration);
        this.#pineconeClient = new PineconeClient();
    }

    private init(): Promise<void> {
        return this.#pineconeClient.init({
            apiKey: PINECONE_API_KEY 
            , environment: PINECONE_ENVIRONMENT 
        });
    }

    createEmbedding(messages: MessageProperties[]): Promise<number[]> {
        const message = messages.findLast(m => m.role === "user");
        if (message === undefined) return Promise.reject(new Error("user message not found"));

        return this.#openai.createEmbedding({
            model: "text-embedding-ada-002"
            , input: message.content
        }).then((response) => {
            return response.data.data[0].embedding;
        });
    }

    ask(messages: MessageProperties[], embeddings: string): Promise<MessageProperties[]> {
        return this.#openai.createChatCompletion({
            model: "gpt-3.5-turbo"
            , messages: [
                { role: "system", content: SYSTEM_PROMPT }
                , { role: "assistant", content: embeddings }
                , messages.findLast(m => m.role === "user")
            ]
        })
            .then((completion) => completion.data.choices.map(c => c.message as MessageProperties));
    }

    getRelatedEmbeddings(messages: MessageProperties[], token_badget: number): Promise<string> {
        return this.createEmbedding(messages)
            .then((embedding) => {
                const index = pineconeClient.Index(PINECONE_INDEX);
                // @see: https://docs.pinecone.io/docs/node-client#indexquery
                return index.query({
                    queryRequest : {
                        namespace: "example-namespace"
                        , topK: 10
                        // , filter: {
                        //     genre: { $in: ["comedy", "documentary", "drama"] }
                        // }
                        , includeValues: true
                        , includeMetadata: true
                        , vector: embedding
                    }
                });
            })
            .then((queryResponse) => {
                if (queryResponse.matches === undefined) {
                    throw new Error("No matches found.");
                }
                const { articles } = queryResponse.matches.reduce((tmp, match) => {
                    if (match.metadata === undefined) {
                        console.log("No metadata found.");
                        return tmp;
                    }
                    const nextArticles = `Wikipedia article section:\n${ (match.metadata as MyMetadata).text }`;
                    if (tmp.length + nextArticles.length > token_badget) {
                        return tmp;
                    } else {
                        tmp.articles.push(nextArticles);
                        tmp.length += nextArticles.length + 2;
                        return tmp;
                    }
                }, { articles: new Array<string>(), length: 0 });

                return articles.join("\n\n");
            });
    }
}