import { NextSdrEntity, ForeignKey } from "@nfa/next-sdr";
import { Pec } from "../baborg/Pec";
import { MessageFolder } from "./MessageFolder";
import { Utente } from "../baborg/Utente";

export class Folder implements NextSdrEntity {
    id: number;
    name: string;
    description: string;
    type: string;

    idPec: Pec;
    idUtente: Utente;
    messageFolderList: MessageFolder[];
    version: Date;

    fk_idPec: ForeignKey;
    fk_idUtente: ForeignKey;
    fk_messageFolderList: ForeignKey;
}

export const FolderType = {
    DRAFT: "DRAFT",
    INBOX: "INBOX",
    OUTBOX: "OUTBOX",
    TRASH : "TRASH",
    SPAM : "SPAM",
    CUSTOM: "CUSTOM",
    SENT: "SENT",
    REGISTERED: "REGISTERED"
    // READDRESSED: "READDRESSED"
};
