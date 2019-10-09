import { NextSdrEntity, ForeignKey } from "@nfa/next-sdr";
import { Azienda } from "./Azienda";

export class Struttura implements NextSdrEntity {

    id: number;
    codice: string;
    nome: string;
    attiva: boolean;
    dislocazione: string;
    spettrale: boolean;
    codiceDislocazione: boolean;
    usaSegreteriaBucataPadre: boolean;
    foglia: boolean;
    dataAttivazione: Date;
    dataCessazione: Date;

    idAzienda: Azienda;
    idStrutturaReplicata: Struttura;
    version: Date;
    
    fk_strutturaUnificataDestinazioneSet: ForeignKey;
    fk_strutturaUnificataSorgenteSet: ForeignKey;
    fk_idAzienda: ForeignKey;
    fk_utenteStrutturaSet: ForeignKey;
    fk_idStrutturaSegreteria: ForeignKey;
    fk_idStrutturaPadre: ForeignKey;
    fk_struttureFiglieSet: ForeignKey;
    fk_struttureSegretariateSet: ForeignKey;
    fk_pecStrutturaSet: ForeignKey;
    fk_idStrutturaReplicata: ForeignKey;

    // transient
    isPermessoPecPrincipale: boolean;
    propagaPermessoPec: boolean;

    // mancano id e set
}
