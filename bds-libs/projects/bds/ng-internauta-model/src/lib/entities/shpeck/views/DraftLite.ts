import { NextSdrEntity, ForeignKey } from "@nfa/next-sdr";
import { Pec } from "../../baborg/Pec";
import { Message } from "../Message";


export class DraftLite implements NextSdrEntity {
  id: number;
  idPec: Pec;
  subject: string;
  toAddresses: string[];
  ccAddresses: string[];
  hiddenRecipients: boolean;
  createTime: Date;
  updateTime: Date;
  attachmentsNumber: number;
  attachmentsName: string[];
  body: string;
  idMessageRelated: Message;
  messageRelatedType: string;

  fk_idPec: ForeignKey;
  fk_idMessageRelated: ForeignKey;
}