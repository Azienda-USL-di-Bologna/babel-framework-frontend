import { NextSdrEntity } from "@nfa/next-sdr";
import { Pec } from "../baborg/Pec";
import { Applicazione } from "../configurazione/Applicazione";

export class Outbox implements NextSdrEntity {
    id: number;
    idPec: Pec;
    rawData: string;
    ignore: boolean;
    idApplicazione: Applicazione;
    externalId: string;
    inserted: Date;
    subject: string;
    toAddresses: string[];
    ccAddresses: string[];
    hiddenRecipients: boolean;
    createTime: Date;
    updateTime: Date;
    attachmentsNumber: number;
    attachmentsName: string[];
    body: string;
    version: Date;
}
