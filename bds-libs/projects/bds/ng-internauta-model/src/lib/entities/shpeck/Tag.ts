import { NextSdrEntity, ForeignKey } from "@nfa/next-sdr";
import { Pec } from "../baborg/Pec";
import { MessageTag } from "./MessageTag";

export class Tag implements NextSdrEntity {
    id: number;
    name: string;
    description: string;
    type: string;
    visible: boolean;
    firstLevel: boolean;

    idPec: Pec;
    messageTagList: MessageTag[];
    version: Date;

    fk_idPec: ForeignKey;
    fk_messageTagList: ForeignKey;
}

export const TagType = {
    SYSTEM_INSERTABLE_DELETABLE: "SYSTEM_INSERTABLE_DELETABLE",
    SYSTEM_INSERTABLE_NOT_DELETABLE: "SYSTEM_INSERTABLE_NOT_DELETABLE",
    SYSTEM_NOT_INSERTABLE_DELETABLE: "SYSTEM_NOT_INSERTABLE_DELETABLE",
    SYSTEM_NOT_INSERTABLE_NOT_DELETABLE: "SYSTEM_NOT_INSERTABLE_NOT_DELETABLE",
    CUSTOM: "CUSTOM"
};

