import { NextSdrEntity, ForeignKey } from "@nfa/next-sdr";
import { Pec } from "../baborg/Pec";
import { Applicazione } from "../configurazione/Applicazione";
import { MessageTag } from "./MessageTag";
import { MessageFolder } from "./MessageFolder";
import { MessageAddress } from "./MessageAddress";
import { Recepit } from "./Recepit";
import { Note } from "./Note";

export class Message implements NextSdrEntity {
    id: number;
    uuidMessage: string;
    idPec: Pec;
    idApplicazione: Applicazione;
    idRelated: Message;
    subject: string;
    messageStatus: string;
    inOut: string;
    createTime: Date;
    updateTime: Date;
    messageType: string;
    isPec: boolean;
    attachmentsNumber: number;
    uuidRepository: string;
    pathRepository: string;
    name: string;
    receiveTime: Date;
    seen: boolean;
    idRecepit: Recepit;
    idMessagePecgw: number;
    version: Date;

    fk_idPec: ForeignKey;
    fk_idRelated: ForeignKey;
    fk_messageAddressList: ForeignKey;
    fk_messageTagList: ForeignKey;
    fk_messageFolderList: ForeignKey;
    fk_idRelatedList: ForeignKey;
    fk_noteList: ForeignKey;

    messageAddressList: MessageAddress[];
    messageTagList: MessageTag[];
    messageFolderList: MessageFolder[];
    idRelatedList: Message[];
    noteList: Note[];
}

export const InOut = {
    IN: "IN",
    OUT: "OUT"
};

export const MessageStatus = {
    RECEIVED: "RECEIVED",
    SENT: "SENT",
    TO_SEND: "TO_SEND",
    WAITING_RECEPIT : "WAITING_RECEPIT",
    ERROR : "ERROR",
    CONFIRMED: "CONFIRMED"
};

export const MessageType = {
    ERROR: "ERROR",
    MAIL: "MAIL",
    PEC: "PEC",
    RECEPIT : "RECEPIT",
    DRAFT : "DRAFT"
};
