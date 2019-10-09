import { Utente } from "./Utente";
import { Struttura } from "./Struttura";
import { AfferenzaStruttura } from "./AfferenzaStruttura";
import { NextSdrEntity, ForeignKey } from "@nfa/next-sdr";

export class UtenteStruttura implements NextSdrEntity {
    id: number;
    fk_idUtente: ForeignKey;
    fk_idStruttura: ForeignKey;
    fk_permessoSet: ForeignKey;
    fk_idAfferenzaStruttura: ForeignKey;

    idUtente: Utente;
    idStruttura: Struttura;
    idAfferenzaStruttura: AfferenzaStruttura;
    version: Date;
}
