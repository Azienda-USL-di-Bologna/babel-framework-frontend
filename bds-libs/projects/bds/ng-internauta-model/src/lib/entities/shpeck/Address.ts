import { NextSdrEntity, ForeignKey } from "@nfa/next-sdr";
import { MessageAddress } from "./MessageAddress";

export class Address implements NextSdrEntity {
    id: number;
    mailAddress: string;
    originalAddress: string;
    recipientType: string;
    version: Date;

    messageAddressList: MessageAddress[];
}
