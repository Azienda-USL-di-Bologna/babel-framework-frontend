import { NextSdrEntity, ForeignKey } from "@nfa/next-sdr";
import { Message } from "./Message";
import { Folder } from "./Folder";
import { Utente } from "../baborg/Utente";

export class MessageFolder implements NextSdrEntity {
    id: number;
    idMessage: Message;
    idFolder: Folder;
    idUtente: Utente;
    inserted: Date;
    deleted: boolean;
    notes: string;
    version: Date;

    fk_idMessage: ForeignKey;
    fk_idFolder: ForeignKey;
    fk_idUtente: ForeignKey;
    fk_idPreviousFolder: ForeignKey;
}
