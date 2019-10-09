import { NextSdrEntity } from "@nfa/next-sdr";

export class TemplateMessaggio implements NextSdrEntity {
  id: number;
  nomeTemplate: string;
  titolo: string;
  testo: string;
  idApplicazioni: string[];
  idAziende: number[];
  idStrutture: number[];
  idPersone: number[];
  perTutti: boolean;
  invasivita: string;
  tipologia: string;
  severita: string;
  intervallo: number;
  dataInserimento: Date;
  dataUltimaModifica: Date;
  version: Date;
}
