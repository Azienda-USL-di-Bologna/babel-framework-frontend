import { NextSdrEntity, ForeignKey } from "@nfa/next-sdr";

export class Ruolo implements NextSdrEntity {
    id: number;
    nome: string;
    nomeBreve: string;
    mascheraBit: number;
    superAziendale: boolean;
    version: Date;
}

