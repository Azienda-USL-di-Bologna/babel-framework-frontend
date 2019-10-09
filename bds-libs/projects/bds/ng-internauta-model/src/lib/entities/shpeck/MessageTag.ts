import { NextSdrEntity, ForeignKey } from "@nfa/next-sdr";
import { Tag } from "./Tag";
import { Message } from "./Message";
import { Utente } from "../baborg/Utente";

export class MessageTag implements NextSdrEntity {
    id: number;
    idMessage: Message;
    idTag: Tag;
    idUtente: Utente;
    inserted: Date;
    additionalData: string;
    version: Date;

    fk_idMessage: ForeignKey;
    fk_idTag: ForeignKey;
    fk_idUtente: ForeignKey;
}
