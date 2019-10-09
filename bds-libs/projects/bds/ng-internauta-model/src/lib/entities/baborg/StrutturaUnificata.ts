import { NextSdrEntity, ForeignKey } from "@nfa/next-sdr";
import { Struttura } from "./Struttura";

export class StrutturaUnificata implements NextSdrEntity {
    id: number;
    idStrutturaSorgente: Struttura;
    idStrutturaDestinazione: Struttura;
    tipoOperazione: string;
    dataAttivazione: Date;
    dataDisattivazione: Date;
    dataAccensioneAttivazione: Date;
    dataInserimentoRiga: Date;
    version: Date;

    fk_idStrutturaSorgente: ForeignKey;
    fk_idStrutturaDestinazione: ForeignKey;
  }
