import { NextSdrEntity } from "@nfa/next-sdr";

export class AmministrazioneMessaggio implements NextSdrEntity {
  id: number;
  titolo: string;
  testo: string;
  idApplicazioni: string[];
  idAziende: number[];
  idStrutture: number[];
  idPersone: number[];
  perTutti: boolean;
  dataPubblicazione: Date;
  invasivita: string;
  tipologia: string;
  severita: string;
  intervallo: number;
  dataScadenza: Date;
  dataInserimento: Date;
  dataUltimaModifica: Date;
  version: Date;
}

export const InvasivitaEnum = {
  LOGIN: "LOGIN",
  POPUP: "POPUP"
};

export const SeveritaEnum = {
  INFO: "INFO",
  WARNING: "WARNING",
  ERROR: "ERROR"
};

export const TipologiaEnum = {
  RIPRESENTA_CON_INTERVALLO: "RIPRESENTA_CON_INTERVALLO",
  MOSTRA_UNA_SOLA_VOLTA: "MOSTRA_UNA_SOLA_VOLTA",
  CONSENTI_SCELTA: "CONSENTI_SCELTA"
};
