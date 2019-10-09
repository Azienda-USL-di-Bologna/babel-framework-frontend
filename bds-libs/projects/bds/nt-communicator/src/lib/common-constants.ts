import { EntitiesConfiguration } from "@nfa/next-sdr";

export const LOCAL_IT = {
    firstDayOfWeek: 1,
    dayNames: ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"],
    dayNamesShort: ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"],
    dayNamesMin: ["Do", "Lu", "Ma", "Me", "Gi", "Ve", "Sa"],
    monthNames: [
        "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
    ],
    monthNamesShort: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"],
    today: "Oggi",
    clear: "Svuota"
};
// valore che passiamo come limit quando non vogliamo Limitare i risultati (visto che il server se non glielo passi limita a 20)
// il server limita comunque a 2000 anche se gli metto un numero più alto
export const NO_LIMIT: number = 2000;


// export const CODICI_AZIENDA = {
//     AUSLBO: "105",
//     IOR: "960",
//     AUSLPR: "102",
//     AUSLFE: "109",
//     AOSPBO: "908",
//     AOSPFE: "909",
//     AUSLIM: "106",
//     AOSPPR: "902",
// }

// export const AZIENDA_CORRENTE = "AZIENDA_CORRENTE";


// export const CODICI_RUOLO = {
//     UG: "UG", // aziendale
//     MOS: "MOS", // aziendale
//     OS: "OS", // aziendale
//     CA: "CA", // aziendale
//     CI: "CI", // interaziendale
//     AS: "AS", // interaziendale
//     SD: "SD", // interaziendale
// }


// export enum FluxPermission {
//     REDIGE = "REDIGE",
//     FIRMA = "FIRMA"
//     // aggiungere altri permessi di flusso all'occorrenza
// }



export const AFFERENZA_STRUTTURA = {
    DIRETTA: 1,
    FUNZIONALE: 3,
    UNIFICATA: 9,
    TEST: 7
};
export const PROJECTIONS = {
    azienda: {
        standardProjections: {
            AziendaWithPlainFields: "AziendaWithPlainFields",
        },
        customProjections: {
        }
    },
    struttura: {
        standardProjections: {
            StrutturaWithIdAzienda: "StrutturaWithIdAzienda"
        },
        customProjections: {
            StrutturaPlainWithPermessiCustom: "StrutturaPlainWithPermessiCustom"
        }
    },
    utente: {
        standardProjections: {
            UtenteWithPlainFields: "UtenteWithPlainFields",
            UtenteWithIdPersona: "UtenteWithIdPersona",
            UtenteWithIdAziendaAndIdPersona: "UtenteWithIdAziendaAndIdPersona"
        },
        customProjections: {
            customUtenteProjection1: "customUtenteProjection1",
            customUtenteProjection2: "customUtenteProjection2",
        }
    },
    utentestruttura: {
        standardProjections: {
        },
        customProjections: {
            UtenteStrutturaWithIdAfferenzaStrutturaCustom: "UtenteStrutturaWithIdAfferenzaStrutturaCustom",
        }
    },
    strutturaunificata: {
        standardProjections: {
            StrutturaUnificataWithIdStrutturaDestinazioneAndIdStrutturaSorgente: "StrutturaUnificataWithIdStrutturaDestinazioneAndIdStrutturaSorgente"
        },
        customProjections: {
            StrutturaUnificataCustom: "StrutturaUnificataCustom"
        }
    },
    pec: {
        standardProjections: {
            PecWithPlainFields: "PecWithPlainFields",
            PecWithIdPecProvider: "PecWithIdPecProvider"
        },
        customProjections: {
            PecPlainWithPermessiCustom: "PecPlainWithPermessiCustom",
            PecPlainWithPermessiAndGestoriCustom: "PecPlainWithPermessiAndGestoriCustom",
            PecWithPecProviderAndAziendaCustom: "PecWithPecProviderAndAziendaCustom"
        }
    },
    persona: {
        standardProjections: {
            PersonaWithPlainFields: "PersonaWithPlainFields",
            PersonaWithAttivitaList: "PersonaWithAttivitaList"
        },
        customProjections: {
            PersonaPlainWithPermessiCustom: "PersonaPlainWithPermessiCustom"
        }
    },
    pecazienda: {
        standardProjections: {
            PecAziendaWithIdAziendaAndIdPec: "PecAziendaWithIdAziendaAndIdPec",
        },
        customProjections: {
        }
    }
};
export const ENTITIES_CONFIGURATION: EntitiesConfiguration = {
    azienda: {
        path: "azienda",
        standardProjections: {},
        customProjections: {},
        collectionResourceRel: "azienda",
        keyName: "id",
    },
    struttura: {
        path: "struttura",
        standardProjections: {},
        customProjections: {},
        collectionResourceRel: "struttura",
        keyName: "id",
    },
    utente: {
        path: "utente",
        standardProjections: {},
        customProjections: {},
        collectionResourceRel: "utente",
        keyName: "id",
    },
    utentestruttura: {
        path: "utentestruttura",
        standardProjections: {},
        customProjections: {},
        collectionResourceRel: "utentestruttura",
        keyName: "id",
    },
    strutturaunificata: {
        path: "strutturaunificata",
        standardProjections: {},
        customProjections: {},
        collectionResourceRel: "strutturaunificata",
        keyName: "id",
    },
    pec: {
        path: "pec",
        standardProjections: {},
        customProjections: {},
        collectionResourceRel: "pec",
        keyName: "id",
    },
    persona: {
        path: "persona",
        standardProjections: {},
        customProjections: {},
        collectionResourceRel: "persona",
        keyName: "id",
    },
    pecprovider: {
        path: "pecprovider",
        standardProjections: {},
        customProjections: {},
        collectionResourceRel: "pecprovider",
        keyName: "id",
    },
    pecazienda: {
        path: "pecazienda",
        standardProjections: {},
        customProjections: {},
        collectionResourceRel: "pecazienda",
        keyName: "id",
    }
};
export enum BaseUrlType {
    Baborg,
    Permessi,
    Login,
    Logout,
    Ribaltone
}
export const BaseUrls: Map<BaseUrlType, string> = new Map<BaseUrlType, string>([
    [BaseUrlType.Baborg, "/internauta-api/resources/baborg"],
    [BaseUrlType.Permessi, "/internauta-api/resources/permessi"],
    [BaseUrlType.Login, "/internauta-api/login"],
    [BaseUrlType.Logout, "/Shibboleth.sso/Logout"],
    [BaseUrlType.Ribaltone, "/internauta-api/resources/baborg/ribaltone/lanciaRibaltone"]
]);

export function getInternautaUrl(type: BaseUrlType, relative = false): string {
    if (!BaseUrls.has(type)) {
        throw new Error("Failed to obtain internauta url, type does not exists!");
    }

    if (!!relative) {
        return BaseUrls.get(type);
    }

    const wl = window.location;
    // tslint:disable-next-line:max-line-length
    const out: string = wl.protocol + "//" + wl.hostname + (wl.hostname === "localhost" ? ":" + LOCALHOST_PORT : ":" + wl.port) + BaseUrls.get(type);

    return out;
}

export const LOCALHOST_PORT = "10005";
// export const LOGIN_ROUTE: string = "/login";
// export const HOME_ROUTE: string = "/homepage";
// export const BABORG_ROUTE: string = "/baborg";
// export const BABELMAN_URL = "https://babelman-auslbo.avec.emr.it/";
