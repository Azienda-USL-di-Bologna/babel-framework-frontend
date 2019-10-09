import { NextSdrEntity, ForeignKey } from "@nfa/next-sdr";
import { Azienda } from "./Azienda";
import { PecProvider } from "./PecProvider";
import { PecAzienda } from "./PecAzienda";
import { Tag } from "../shpeck/Tag";
import { Folder } from "../shpeck/Folder";

export class Pec implements NextSdrEntity {
    id: number;
    indirizzo: string;
    username: string;
    password: string;
    attiva: boolean;
    messagePolicy: number;
    perRiservato: boolean;
    idPecProvider: PecProvider;
    fk_idPecProvider: ForeignKey;
    idAzienda: Azienda;
    fk_idAzienda: ForeignKey;
    descrizione: string;
    massiva: boolean;
    chiusa: boolean;
    pecAziendaList: PecAzienda[];
    tagList: Tag[];
    folderList: Folder[];
    version: Date;
}
