import { NextSdrEntity, ForeignKey } from "@nfa/next-sdr";
import { Azienda } from "../baborg/Azienda";
import { Applicazione } from "../configurazione/Applicazione";

export class Menu implements NextSdrEntity {
    id: number;
    idAzienda: Azienda;
    idApplicazione: Applicazione;
    descrizione: string;
    permessiSufficienti: string[];
    openCommand: string;
    compiledUrl: string;
    version: Date;

    fk_idAzienda: ForeignKey;
    fk_idApplicazione: ForeignKey;
}
