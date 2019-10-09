import { NextSdrEntity, ForeignKey } from "@nfa/next-sdr";
import { Message } from "./Message";
import { Utente } from "../baborg/Utente";

export class Note implements NextSdrEntity {
  id: number;
  idMessage: Message;
  idUtente: Utente;
  memo: string;
  createTime: Date;
  updateTime: Date;
  version: Date;

  fk_idMessage: ForeignKey;
  fk_idUtente: ForeignKey;
}
