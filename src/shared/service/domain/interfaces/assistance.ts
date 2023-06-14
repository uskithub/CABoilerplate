import { Observable } from "rxjs";
import { MessageProperties } from "../chat/message";

export interface Assistance {

    ask(messages: MessageProperties[]): Observable<MessageProperties[]>
}