import { NextSdrEntity, ForeignKey } from "@nfa/next-sdr";
import { Azienda } from "../baborg/Azienda";
import { Utente } from "../baborg/Utente";

export class RibaltoneDaLanciare implements NextSdrEntity {
    id: number;
    codiceAzienda: string;
    email: string;
    stato: string;
    dataInserimentoRiga: Date;
    dataUltimaModifica: Date;
    idUtente: Utente;
    idAzienda: Azienda;
    note: string;
    strutture_spostate: boolean;
    ribaltaInternauta: boolean;
    ribaltaArgo: boolean;
    ribaltaRubriche: boolean;
    log: string;
    version: Date;

    fk_utente: ForeignKey;
    fk_azienda: ForeignKey;
}

