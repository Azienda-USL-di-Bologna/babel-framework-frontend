import { NextSdrEntity, ForeignKey } from "@nfa/next-sdr";
import { Persona } from "./Persona";
import { Ruolo } from "./Ruolo";
import { Azienda } from "./Azienda";
import { PermessoEntitaStoredProcedure } from "../transient/PermessoEntitaStoredProcedure";


export class Utente implements NextSdrEntity {
    id: number;
    username: string;
    fax: string;
    dominio: string;
    email: string;
    attivo: boolean;
    telefono: string;
    passwordHash: boolean;
    omonimia: boolean;
    bitRuoli: number;
    idInquadramento: number;
    idRuoloAziendale: number;
    idPersona: Persona;
    idAzienda: Azienda;
    aziende: Azienda[]; // nel caso del loggedUser è un lista di projection CustomAziendaLogin
    version: Date;

    fk_idAzienda: ForeignKey;
    fk_idPersona: ForeignKey;
    fk_pecUtenteList: ForeignKey;
    fk_utenteStrutturaList: ForeignKey;

    // CAMPI TRANSIENT
    permessiDiFlusso: PermessoEntitaStoredProcedure[];
    ruoli: Ruolo[];
    /**
    * tutti i ruoli di tutte le aziende della persona dell'utente, divisi per interaziendali e aziendali.
    * mappa in cui la chiave è il codiceAzienda e il valore la lista dei codici ruolo per quell'azienda
    * nel caso dei ruoli interaziendali la chiave è 'interaziendali'
    */
    ruoliUtentiPersona: any;
    utenteReale: Utente;
    permessiDiFlussoByCodiceAzienda: any;

    // campo in CustomUtenteLogin
    aziendaLogin: Azienda; // è in realtà la projection CustomAziendaLogin


    // CAMPI TRANSIENT NON PRESENTI NELL'ENTITA' BACKEND
    hasPermessoDelega: boolean;


    // TODO: è da eliminare. Bisogna usare isSD() di UtenteUtilities
    public isDemiurgo(): boolean {
        return this.ruoli.find(k => k.nomeBreve === "SD") !== undefined;
    }
}
