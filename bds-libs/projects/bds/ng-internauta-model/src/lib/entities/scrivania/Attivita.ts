import { NextSdrEntity, ForeignKey } from "@nfa/next-sdr";
import { Azienda } from "../baborg/Azienda";
import { Applicazione } from "../configurazione/Applicazione";

export class Attivita implements NextSdrEntity {
    id: number;
    idAzienda: Azienda;
    idApplicazione: Applicazione;
    descrizione: string;
    tipo: string;
    oggetto: string;
    aperta: boolean;
    dataInserimentoRiga: Date;
    dataUltimaModifica: Date;
    note: string;
    provenienza: string;
    dataScadenza: Date;
    priorita: number;
    oggettoEsterno: number;
    tipoOggettoEsterno: string;
    oggettoEsternoSecondario: number;
    tipoOggettoEsternoSecondario: string;
    datiAggiuntivi: any;
    allegati: string;
    classe: string;
    data: Date;
    tags: string[];
    urls: string;
    compiledUrls: string;
    version: Date;

    fk_idAzienda: ForeignKey;
    fk_idPersona: ForeignKey;
    fk_idApplicazione: ForeignKey;
}
