import { NextSdrEntity, ForeignKey } from "@nfa/next-sdr";

export class AfferenzaStruttura implements NextSdrEntity {
    id: number;
    descrizione: string;
    codice: string;
    fk_utenteStrutturaSet: ForeignKey;
    version: Date;

    // mancano set
}
