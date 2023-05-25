import { ValueObject } from "@/shared/system/interfaces/architecture";
import dependencies from "../dependencies";

export type ConsultationProperties = {
};

export class Consultation implements ValueObject<ConsultationProperties>{
    properties: ConsultationProperties;

    constructor(properties: ConsultationProperties) {
        this.properties = properties;
    }

    /**
     * アプリは内容をVector情報として保存できること。
     */
    larn(): void {
        dependencies.recollection.larn();
    }
}