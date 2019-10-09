import { NextSdrEntity, ForeignKey } from "@nfa/next-sdr";
import { Azienda } from "./Azienda";
import { Pec } from "./Pec";

export class PecAzienda implements NextSdrEntity {
    id: number;
    dataInserimentoRiga: Date;
    fk_idPec: ForeignKey;
    fk_idAzienda: ForeignKey;
    idAzienda: Azienda;
    idPec: Pec;
    version: Date;
}
