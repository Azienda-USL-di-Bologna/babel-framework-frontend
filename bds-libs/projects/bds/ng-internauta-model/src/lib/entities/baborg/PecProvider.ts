import { NextSdrEntity, ForeignKey } from "@nfa/next-sdr";

export class PecProvider implements NextSdrEntity {
  id: number;
  descrizione: string;
  pec: boolean;
  host: string;
  port: number;
  protocol: string;
  host_out: string;
  port_out: number;
  protocol_out: string;
  version: Date;
}
