import { Adviser } from "../../domain/interfaces/adviser";

import { OpenAI } from "langchain/llms/openai";
import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";



export class Gpt4Adviser implements Adviser {
    #llmChain: LLMChain; 

    constructor() {
        const openAi = new OpenAI({ openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY, temperature: 0.9 });
        const prompt = new PromptTemplate({
            inputVariables: ["product"]
            , template: "{product}を作る日本語の新会社名をを1つ提案してください"
        });
        
        this.#llmChain = new LLMChain({ llm: openAi, prompt });
    }

    input(): Promise<void> {
        return Promise.resolve();
    }

    output(): Promise<string> {
        return this.#llmChain.call({ 
            product: "家庭用ロボット" 
        }).then(chainValues => {
            console.log("chainValues", chainValues);
            return chainValues.text as string;
        });
    }
}