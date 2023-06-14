import ServiceModel from "@domain/services/service";
import { MessageProperties } from "@/shared/service/domain/chat/message";
import { Actor, boundary, Boundary, ContextualizedScenes, Usecase } from "robustive-ts";
import { catchError, map, Observable } from "rxjs";
/**
 * usecase: 相談する
 */
const scenes = {
    /* Basic Courses */
    userInputsQuery: "ユーザは質問を入力する"
    , serviceChecksIfThereAreExistingMessages: "サービスは既存の会話があるか確認する"
    , ifThereAreThenServiceGetRelatedVectors: "ある場合_サービスは会話に関連するベクトル情報を取得する"
    , onSuccessThenServiceAskAI: "成功した場合_サービスはAIに問い合わせする"
    /* Alternate Courses */
    , ifNotThenServiceGetRelatedVectors: "ない場合_サービスは質問に関連するベクトル情報を取得する"

    /* Boundaries */
    , goals: {
        /* Basic Courses */
        onSuccessThenServiceDisplaysMessages: "成功した場合_サービスは会話を表示する"
        /* Alternate Courses */
        , onFailureThenServicePresentsError: "失敗した場合_サービスはエラーを表示する"
    }
} as const;


type Consult = typeof scenes[keyof typeof scenes];

type Goals = ContextualizedScenes<{
    [scenes.goals.onSuccessThenServiceDisplaysMessages]: { messages: MessageProperties[]; }
    [scenes.goals.onFailureThenServicePresentsError]: { error: Error; }
}>;

type Scenes = ContextualizedScenes<{
    [scenes.userInputsQuery]: { messages: MessageProperties[]; }
    [scenes.serviceChecksIfThereAreExistingMessages]: { messages: MessageProperties[]; }
    [scenes.ifThereAreThenServiceGetRelatedVectors]: { messages: MessageProperties[]; vector: string }
    [scenes.onSuccessThenServiceAskAI]: { messages: MessageProperties[]; vector: string }
    [scenes.ifNotThenServiceGetRelatedVectors]: { messages: MessageProperties[]; vector: string }
}> | Goals;

export const isConsultGoal = (context: any): context is Goals => context.scene !== undefined && Object.values(scenes.goals).find(c => { return c === context.scene; }) !== undefined;
export const isConsultScene = (context: any): context is Scenes => context.scene !== undefined && Object.values(scenes).find(c => { return c === context.scene; }) !== undefined;

export const Consult = scenes;
export type ConsultGoals = Goals;
export type ConsultScenes = Scenes;

export class ConsultUsecase extends Usecase<Scenes> {

    override authorize<T extends Actor<T>>(actor: T): boolean {
        return ServiceModel.authorize(actor, this);
    }

    next(): Observable<this>|Boundary {
        switch (this.context.scene) {
        case scenes.userInputsQuery: {
            return this.just({ scene: scenes.serviceChecksIfThereAreExistingMessages, messages: this.context.messages });
        }
        case scenes.serviceChecksIfThereAreExistingMessages : {
            return this.check();
        }
        // case scenes.goals.sessionExistsThenServicePresentsHome:
        // case scenes.goals.sessionNotExistsThenServicePresentsSignin:
        // case scenes.goals.onUpdateUsersTasksThenServiceUpdateUsersTaskList: {
        //     return boundary;
        // }
        }
    }

    private check(): Observable<this>|Boundary {
        // const messages = this.context.messages;
        // if (messages.length > 0) {
        //     return this.just({ scene: scenes.ifThereAreThenServiceGetRelatedVectors, messages });
        // }
        // return this.just({ scene: scenes.ifNotThenServiceGetRelatedVectors, messages });
    }
}