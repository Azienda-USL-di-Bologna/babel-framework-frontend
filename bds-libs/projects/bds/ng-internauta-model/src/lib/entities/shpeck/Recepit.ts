import { NextSdrEntity, ForeignKey } from "@nfa/next-sdr";
import { Message } from "./Message";

export class Recepit implements NextSdrEntity {
    id: number;
    idMessage: Message;
    recepitType: string;
    version: Date;
}

export const RecepitType = {
    ACCETTAZIONE: "ACCETTAZIONE",
    PREAVVISO_ERRORE_CONSEGNA: "PREAVVISO_ERRORE_CONSEGNA",
    PRESA_IN_CARICO: "PRESA_IN_CARICO",
    NON_ACCETTAZIONE: "NON_ACCETTAZIONE",
    RILEVAZIONE_VIRUS: "RILEVAZIONE_VIRUS",
    ERRORE_CONSEGNA: "ERRORE_CONSEGNA",
    CONSEGNA: "CONSEGNA"
};
