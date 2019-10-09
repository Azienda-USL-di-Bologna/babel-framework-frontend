import { NextSdrEntity, ForeignKey } from "@nfa/next-sdr";
import { RibaltoneDaLanciare } from "../ribaltone-utils/RibaltoneDaLanciare";

export class Azienda implements NextSdrEntity {
    id: number;
    path: string;
    nome: string;
    parametri: string;
    descrizione: string;
    codice: string;
    schemaGru: string;
    aoo: string;
    codiceRegione: string;
    idAziendaGru: number;
    ribaltaInternauta: boolean;
    ribaltaArgo: boolean;
    ribaltoneDaLanciareList: RibaltoneDaLanciare[];

    fk_strutturaSet: ForeignKey;
    fk_idpEntityIdSet: ForeignKey;
    fk_pecSet: ForeignKey;
    fk_utenteSet: ForeignKey;
    version: Date;

    urlCommands: any; // valorizzato quando stiamo usando la projection CustomAziendaLogin

}

