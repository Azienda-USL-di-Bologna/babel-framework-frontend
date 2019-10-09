import { NextSdrEntity, ForeignKey } from "@nfa/next-sdr";
import { Message } from "./Message";
import { Pec } from "../baborg/Pec";

export class Draft implements NextSdrEntity {
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
  eml: any;
  idMessageRelated: Message;
  messageRelatedType: string;
  version: Date;

  fk_idPec: ForeignKey;
  fk_idMessageRelated: ForeignKey;
}

export const MessageRelatedType = {
  REPLIED: "REPLIED",
  REPLIED_ALL: "REPLIED_ALL",
  FORWARDED: "FORWARDED"
};
