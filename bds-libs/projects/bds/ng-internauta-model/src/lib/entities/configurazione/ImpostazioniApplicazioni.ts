import { NextSdrEntity, ForeignKey } from "@nfa/next-sdr";
import { Persona } from "../baborg/Persona";
import { Applicazione } from "./Applicazione";

export class ImpostazioniApplicazioni implements NextSdrEntity {
    id: number;
    idPersona: Persona;
    idApplicazione: Applicazione;
    impostazioniVisualizzazione: string;
    version: Date;

    fk_idPersona: ForeignKey;
    fk_idApplicazione: ForeignKey;
}
