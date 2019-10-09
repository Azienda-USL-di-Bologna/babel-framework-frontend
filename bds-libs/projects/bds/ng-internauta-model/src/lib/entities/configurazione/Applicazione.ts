import { NextSdrEntity, ForeignKey } from "@nfa/next-sdr";
import { AttivitaFatta } from "../scrivania/AttivitaFatta";
import { Attivita } from "../scrivania/Attivita";
import { Menu } from "../scrivania/Menu";

export class Applicazione implements NextSdrEntity {
id: string;
nome: string;
baseUrl: string;
indexPage: string;
attivitaList: Attivita[];
attivitaFattaList: AttivitaFatta[];
menuList: Menu[];
version: Date;

fk_attivitaList: ForeignKey;
fk_attivitaFattaList: ForeignKey;
fk_menuList: ForeignKey;
}
