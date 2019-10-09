import { NextSdrEntity, ForeignKey } from "@nfa/next-sdr";
import { PermessiEntita } from "@bds/nt-communicator";
import { ImpostazioniApplicazioni } from "../configurazione/ImpostazioniApplicazioni";
export class Persona implements NextSdrEntity {
    id: number;
    descrizione: string;
    nome: string;
    cognome: string;
    attiva: boolean;
    bitRuoli: number;
    codiceFiscale: string;
    permessi: PermessiEntita[];
    impostazioniApplicazioniList: ImpostazioniApplicazioni[];
    messaggiVisti: number[];
    permessiPec: any;
    version: Date;
    fk_utenteList: ForeignKey;
}

