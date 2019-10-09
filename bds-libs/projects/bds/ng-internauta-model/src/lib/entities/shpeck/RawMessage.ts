import { NextSdrEntity, ForeignKey } from "@nfa/next-sdr";
import { Message } from "./Message";

export class RawMessage implements NextSdrEntity {
    id: number;
    rawData: string;
    idMessage: Message;
    version: Date;

    fk_idMessage: ForeignKey;
}
