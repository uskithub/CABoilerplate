import { Observable } from "rxjs";
import { MessageProperties } from "../chat/message";

export interface Assistance {

    ask(messages: MessageProperties[], embeddings: string): Promise<MessageProperties[]>

    createEmbedding(messages: MessageProperties[]): Promise<number[]>
    
    /**
     * 関連する情報を取得する
     * @param messages 
     */
    getRelatedEmbeddings(messages: MessageProperties[], token_badget: number): Promise<string>
}