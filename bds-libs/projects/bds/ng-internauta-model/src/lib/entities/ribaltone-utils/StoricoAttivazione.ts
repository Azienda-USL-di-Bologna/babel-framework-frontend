import { NextSdrEntity, ForeignKey } from "@nfa/next-sdr";
import { Azienda } from "../baborg/Azienda";
import { Utente } from "../baborg/Utente";

export class StoricoAttivazione implements NextSdrEntity {
    id: number;
    idAzienda: Azienda;
    dataInserimentoRiga: Date;
    ribaltaInternauta: boolean;
    ribaltaArgo: boolean;
    idUtente: Utente;
    note: string;
    version: Date;

    fk_utente: ForeignKey;
    fk_azienda: ForeignKey;
}

