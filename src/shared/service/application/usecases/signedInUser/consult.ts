import { Message, MessageProperties } from "@/shared/service/domain/chat/message";
import { SignedInUser } from ".";
import { MyBaseScenario } from "../common";

import type { Context, MutableContext } from "robustive-ts";

const _u = SignedInUser.consult;

/**
 * usecase: 相談する
 */
export type ConsultScenes = {
    basics : {
        [_u.basics.userInputsQuery]: { messages: MessageProperties[]; };
        [_u.basics.serviceChecksIfThereAreExistingMessages]: { messages: MessageProperties[]; };
        [_u.basics.ifThereAreThenServiceGetRelatedVectors]: { messages: MessageProperties[] };
        [_u.basics.onSuccessThenServiceAskAI]: { messages: MessageProperties[]; embeddings: string };
    };
    alternatives: {
        [_u.alternatives.ifNotThenServiceGetRelatedVectors]: { messages: MessageProperties[] };
    };
    goals : {
        [_u.goals.onSuccessThenServiceDisplaysMessages]: { messages: MessageProperties[]; };
        [_u.goals.onFailureThenServicePresentsError]: { error: Error; };
    };
};

export class ConsultScenario extends MyBaseScenario<ConsultScenes> {

    next(to: MutableContext<ConsultScenes>): Promise<Context<ConsultScenes>> {
        switch (to.scene) {
        case _u.basics.userInputsQuery: {
            return this.just(this.basics[_u.basics.serviceChecksIfThereAreExistingMessages]({ messages: to.messages }));
        }
        case _u.basics.serviceChecksIfThereAreExistingMessages: {
            return this.check(to.messages);
        }
        case _u.alternatives.ifNotThenServiceGetRelatedVectors: {
            return this.getRelatedEmbeddings(to.messages);
        }
        case _u.basics.ifThereAreThenServiceGetRelatedVectors: {
            return this.getRelatedEmbeddings(to.messages);
        }
        case _u.basics.onSuccessThenServiceAskAI: {
            return this.ask(to.messages, to.embeddings);
        }
        default: {
            throw new Error(`not implemented: ${ to.scene }`);
        }
        }
    }

    private check(messages: MessageProperties[]): Promise<Context<ConsultScenes>> {
        if (messages.length === 1) {
            return this.just(this.alternatives[_u.alternatives.ifNotThenServiceGetRelatedVectors]({ messages }));
        }
        return this.just(this.basics[_u.basics.ifThereAreThenServiceGetRelatedVectors]({ messages }));
    }

    private getRelatedEmbeddings(messages: MessageProperties[]): Promise<Context<ConsultScenes>> {
        return new Message(messages).getRelatedEmbeddings()
            .then(embeddings => this.basics[_u.basics.onSuccessThenServiceAskAI]({messages, embeddings}))
        ;
    }

    private ask(messages: MessageProperties[], embeddings: string): Promise<Context<ConsultScenes>> {
        return new Message(messages).createAnswer(embeddings)
            .then(messages => this.goals[_u.goals.onSuccessThenServiceDisplaysMessages]({ messages }));
    }
}