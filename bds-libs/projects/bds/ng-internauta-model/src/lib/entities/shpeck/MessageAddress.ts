import { NextSdrEntity, ForeignKey } from "@nfa/next-sdr";
import { Address } from "./Address";
import { Message } from "./Message";

export class MessageAddress implements NextSdrEntity {
    id: number;
    address: Address;
    addressRole: string;
    idAddress: Address;
    idMessage: Message;
    version: Date;

    fk_idAddress: ForeignKey;
}

export const AddresRoleType = {
    FROM: "FROM",
    TO: "TO",
    CC: "CC"
};
