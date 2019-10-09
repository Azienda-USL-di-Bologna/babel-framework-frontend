/*
 * Public API Surface of ng-internauta-model
 */

export * from "./lib/ng-internauta-model.module";
export * from "./lib/entities/baborg/AfferenzaStruttura";
export * from "./lib/entities/baborg/Azienda";
export * from "./lib/entities/baborg/Persona";
export * from "./lib/entities/baborg/Struttura";
export * from "./lib/entities/baborg/StrutturaUnificata";
export * from "./lib/entities/baborg/Ruolo";
export * from "./lib/entities/baborg/Utente";
export * from "./lib/entities/baborg/UtenteStruttura";
export * from "./lib/entities/baborg/Pec";
export * from "./lib/entities/baborg/PecAzienda";
export * from "./lib/entities/baborg/PecProvider";
export * from "./lib/entities/messaggero/AmministrazioneMessaggio";
export * from "./lib/entities/messaggero/TemplateMessaggio";
export * from "./lib/entities/scrivania/Attivita";
export * from "./lib/entities/scrivania/AttivitaFatta";
export * from "./lib/entities/scrivania/Menu";
export * from "./lib/entities/configurazione/Applicazione";
export * from "./lib/entities/configurazione/ImpostazioniApplicazioni";
export * from "./lib/entities/shpeck/Address";
export * from "./lib/entities/shpeck/Folder";
export * from "./lib/entities/shpeck/Message";
export * from "./lib/entities/shpeck/MessageAddress";
export * from "./lib/entities/shpeck/MessageFolder";
export * from "./lib/entities/shpeck/MessageTag";
export * from "./lib/entities/shpeck/Note";
export * from "./lib/entities/shpeck/Outbox";
export * from "./lib/entities/shpeck/RawMessage";
export * from "./lib/entities/shpeck/Recepit";
export * from "./lib/entities/shpeck/Draft";
export * from "./lib/entities/shpeck/Tag";
export * from "./lib/entities/shpeck/views/DraftLite";
export * from "./lib/entities/shpeck/views/OutboxLite";

export * from "./lib/entities/transient/PermessiStoredProcedure";

export * from "./lib/utils/internauta-utils";
export * from "./lib/entities/definitions";
export * from "./lib/entities/ribaltone-utils/RibaltoneDaLanciare";
export * from "./lib/entities/ribaltone-utils/StoricoAttivazione";

export * from "./lib/services/amministrazione-messaggi.service";
export * from "./lib/services/applicazione.service";
export * from "./lib/services/azienda.service";
export * from "./lib/services/struttura.service";
export * from "./lib/services/template-messaggi.service";
export * from "./lib/services/utente.service";
export * from "./lib/services/persona.service";
