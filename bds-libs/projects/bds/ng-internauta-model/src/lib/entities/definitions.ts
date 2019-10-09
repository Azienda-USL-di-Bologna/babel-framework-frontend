import { EntitiesConfiguration } from "@nfa/next-sdr";


export const CODICI_AZIENDA = {
    AUSLBO: "105",
    IOR: "960",
    AUSLPR: "102",
    AUSLFE: "109",
    AOSPBO: "908",
    AOSPFE: "909",
    AUSLIM: "106",
    AOSPPR: "902",
};

export const AZIENDA_CORRENTE = "AZIENDA_CORRENTE";


export const CODICI_RUOLO = {
    UG: "UG", // aziendale
    MOS: "MOS", // aziendale
    OS: "OS", // aziendale
    CA: "CA", // aziendale
    CI: "CI", // interaziendale
    AS: "AS", // interaziendale
    SD: "SD", // interaziendale
};


export enum FluxPermission {
    REDIGE = "REDIGE",
    FIRMA = "FIRMA"
    // aggiungere altri permessi di flusso all'occorrenza
}

export enum PecPermission {
    RISPONDE = "RISPONDE",
    LEGGE = "LEGGE",
    ELIMINA = "ELIMINA",
    SPEDISCE = "SPEDISCE"
    // aggiungere altri permessi di pec all'occorrenza
}

export const AFFERENZA_STRUTTURA = {
    DIRETTA: 1,
    FUNZIONALE: 3,
    UNIFICATA: 9,
    TEST: 7
};

export interface EntitiesStructure {
    [key: string]: EntitiesConfiguration;
}

export const ENTITIES_STRUCTURE: EntitiesStructure = {
    baborg: {
        azienda: {
            path: "azienda",
            standardProjections: {},
            customProjections: {
                AziendaWithRibaltoneDaLanciareListCustom: "AziendaWithRibaltoneDaLanciareListCustom",
                CustomAziendaDescriptionFields: "CustomAziendaDescriptionFields"
            },
            collectionResourceRel: "azienda",
            keyName: "id"
        },
        struttura: {
            path: "struttura",
            standardProjections: {
                StrutturaWithIdAzienda: "StrutturaWithIdAzienda",
                StrutturaWithIdAziendaAndUtenteStrutturaList: "StrutturaWithIdAziendaAndUtenteStrutturaList"
            },
            customProjections: {},
            collectionResourceRel: "struttura",
            keyName: "id"
        },
        utente: {
            path: "utente",
            standardProjections: {
                UtenteWithIdAziendaAndIdPersona: "UtenteWithIdAziendaAndIdPersona"
            },
            customProjections: {},
            collectionResourceRel: "utente",
            keyName: "id"
        },
        utentestruttura: {
            path: "utentestruttura",
            standardProjections: {},
            customProjections: {},
            collectionResourceRel: "utentestruttura",
            keyName: "id"
        },
        strutturaunificata: {
            path: "strutturaunificata",
            standardProjections: {},
            customProjections: {},
            collectionResourceRel: "strutturaunificata",
            keyName: "id"
        },
        pec: {
            path: "pec",
            standardProjections: {
                PecWithPlainFields: "PecWithPlainFields",
                PecWithTagList: "PecWithTagList",
                PecWithFolderList: "PecWithFolderList",
                PecWithFolderListAndTagList: "PecWithFolderListAndTagList",
                PecWithFolderListAndPecAziendaList: "PecWithFolderListAndPecAziendaList",
                PecWithFolderListAndPecAziendaListAndTagList: "PecWithFolderListAndPecAziendaListAndTagList"
            },
            customProjections: {
                CustomPecWithFolderListAndPecAziendaListAndTagList: "CustomPecWithFolderListAndPecAziendaListAndTagList",
                PecPlainWithPermessiAndGestoriCustom: "PecPlainWithPermessiAndGestoriCustom",
                PecPlainWithStruttureAndGestoriCustom: "PecPlainWithStruttureAndGestoriCustom",
                PecWithPecProviderAndAziendaCustom: "PecWithPecProviderAndAziendaCustom"
            },
            collectionResourceRel: "pec",
            keyName: "id"
        },
        persona: {
            path: "persona",
            standardProjections: {
                PersonaWithPlainFields: "PersonaWithPlainFields",
                PersonaWithUtenteList: "PersonaWithUtenteList",
                PersonaWithAttivitaList: "PersonaWithAttivitaList",
                PersonaWithAttivitaListAndUtenteList: "PersonaWithAttivitaListAndUtenteList",
                PersonaWithAttivitaFattaList: "PersonaWithAttivitaFattaList",
                PersonaWithAttivitaFattaListAndUtenteList: "PersonaWithAttivitaFattaListAndUtenteList",
                PersonaWithAttivitaFattaListAndAttivitaList: "PersonaWithAttivitaFattaListAndAttivitaList",
                PersonaWithAttivitaFattaListAndAttivitaListAndUtenteList: "PersonaWithAttivitaFattaListAndAttivitaListAndUtenteList",
                PersonaWithImpostazioniApplicazioniList: "PersonaWithImpostazioniApplicazioniList"
            },
            customProjections: {
                PersonaPlainWithPermessiCustom: "PersonaPlainWithPermessiCustom",
                CustomPersonaLogin: "CustomPersonaLogin"
            },
            collectionResourceRel: "persona",
            keyName: "id"
        },
        pecprovider: {
            path: "pecprovider",
            standardProjections: {},
            customProjections: {},
            collectionResourceRel: "pecprovider",
            keyName: "id"
        },
        pecazienda: {
            path: "pecazienda",
            standardProjections: {},
            customProjections: {},
            collectionResourceRel: "pecazienda",
            keyName: "id"
        }
    },
    messaggero: {
        amministrazionemessaggio: {
            path: "amministrazionemessaggio",
            standardProjections: {
                AmministrazioneMessaggioWithPlainFields: "AmministrazioneMessaggioWithPlainFields"
            },
            customProjections: {},
            collectionResourceRel: "amministrazionemessaggio",
            keyName: "id"
        },
        templatemessaggio: {
            path: "templatemessaggio",
            standardProjections: {
                TemplateMessaggioWithPlainFields: "TemplateMessaggioWithPlainFields"
            },
            customProjections: {},
            collectionResourceRel: "templatemessaggio",
            keyName: "id"
        }
    },
    scrivania: {
        attivita: {
            path: "attivita",
            standardProjections: {},
            customProjections: {},
            collectionResourceRel: "attivita",
            keyName: "id"
        },
        attivitafatta: {
            path: "attivitafatta",
            standardProjections: {},
            customProjections: {},
            collectionResourceRel: "attivitafatta",
            keyName: "id"
        },
        menu: {
            path: "menu",
            standardProjections: {},
            customProjections: {},
            collectionResourceRel: "menu",
            keyName: "id"
        }
    },
    configurazione: {
        applicazione: {
            path: "applicazione",
            standardProjections: {
                ApplicazioneWithPlainFields: "ApplicazioneWithPlainFields"
            },
            customProjections: {},
            collectionResourceRel: "applicazione",
            keyName: "id"
        },
        impostazioniapplicazioni: {
            path: "impostazioniapplicazioni",
            standardProjections: {},
            customProjections: {},
            collectionResourceRel: "impostazioniapplicazioni",
            keyName: "id"
        }
    },
    shpeck: {
        message: {
            path: "message",
            standardProjections: {},
            customProjections: {
                CustomMessageForMailList: "CustomMessageForMailList",
                CustomRecepitWithAddressList: "CustomRecepitWithAddressList"
            },
            collectionResourceRel: "message",
            keyName: "id"
        },
        recepit: {
            path: "recepit",
            standardProjections: {},
            customProjections: {},
            collectionResourceRel: "recepit",
            keyName: "id"
        },
        address: {
            path: "address",
            standardProjections: {},
            customProjections: {},
            collectionResourceRel: "address",
            keyName: "id"
        },
        messageaddress: {
            path: "messageaddress",
            standardProjections: {},
            customProjections: {},
            collectionResourceRel: "messageaddress",
            keyName: "id"
        },
        folder: {
            path: "folder",
            standardProjections: {},
            customProjections: {},
            collectionResourceRel: "folder",
            keyName: "id"
        },
        messagefolder: {
            path: "messagefolder",
            standardProjections: {},
            customProjections: {},
            collectionResourceRel: "messagefolder",
            keyName: "id"
        },
        tag: {
            path: "tag",
            standardProjections: {},
            customProjections: {},
            collectionResourceRel: "tag",
            keyName: "id"
        },
        messagetag: {
            path: "messagetag",
            standardProjections: {
                MessageTagWithIdTag: "MessageTagWithIdTag",
                MessageTagWithIdMessage: "MessageTagWithIdMessage",
                MessageTagWithIdTagAndIdUtente: "MessageTagWithIdTagAndIdUtente",
                MessageTagWithIdMessageAndIdTag: "MessageTagWithIdMessageAndIdTag",
                MessageTagWithIdMessageAndIdTagAndIdUtente: "MessageTagWithIdMessageAndIdTagAndIdUtente"
            },
            customProjections: {},
            collectionResourceRel: "messagetag",
            keyName: "id"
        },
        rawmessage: {
            path: "rawmessage",
            standardProjections: {},
            customProjections: {},
            collectionResourceRel: "rawmessage",
            keyName: "id"
        },
        draft: {
            path: "draft",
            standardProjections: {},
            customProjections: {
                CustomDraftWithPlainFields: "CustomDraftWithPlainFields"
            },
            collectionResourceRel: "draft",
            keyName: "id"
        },
        draftlite: {
            path: "draftlite",
            standardProjections: {
                DraftLiteWithPlainFields: "DraftLiteWithPlainFields",
                DraftLiteWithIdPec: "DraftLiteWithIdPec"
            },
            customProjections: { },
            collectionResourceRel: "draftlite",
            keyName: "id"
        },
        outbox: {
            path: "outbox",
            standardProjections: {},
            customProjections: {
                CustomOutboxWithPlainFields: "CustomOutboxWithPlainFields"
            },
            collectionResourceRel: "outbox",
            keyName: "id"
        },
        outboxLite: {
            path: "outboxLite",
            standardProjections: {
                OutboxLiteWithPlainFields: "OutboxLiteWithPlainFields",
                OutboxLiteWithIdPec: "OutboxLiteWithIdPec"
            },
            customProjections: {},
            collectionResourceRel: "outboxLite",
            keyName: "id"
        },
        note: {
            path: "note",
            standardProjections: {},
            customProjections: {},
            collectionResourceRel: "note",
            keyName: "id"
        }
    },
    ribaltoneutils: {
        ribaltonedalanciare: {
            path: "ribaltonedalanciare",
            standardProjections: {
                RibaltoneDaLanciareWithIdAziendaAndIdUtente: "RibaltoneDaLanciareWithIdAziendaAndIdUtente"
            },
            customProjections: {
                RibaltoneDaLanciareWithIdAziendaAndIdUtenteCustom: "RibaltoneDaLanciareWithIdAziendaAndIdUtenteCustom"
            },
            collectionResourceRel: "ribaltonedalanciare",
            keyName: "id"
        },
        storicoattivazione: {
            path: "storicoattivazione",
            standardProjections: {
                StoricoAttivazioneWithIdUtente: "StoricoAttivazioneWithIdUtente",
                StoricoAttivazioneWithIdAziendaAndIdUtente: "StoricoAttivazioneWithIdAziendaAndIdUtente"
            },
            customProjections: {
                StoricoAttivazioneWithIdUtenteCustom: "StoricoAttivazioneWithIdUtenteCustom"
            },
            collectionResourceRel: "storicoattivazione",
            keyName: "id"
        }
    },
};
