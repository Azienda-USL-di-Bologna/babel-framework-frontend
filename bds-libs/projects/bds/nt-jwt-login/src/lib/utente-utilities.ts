import { Utente, ImpostazioniApplicazioni, AZIENDA_CORRENTE, CODICI_RUOLO,
    CODICI_AZIENDA, FluxPermission, PecPermission } from "@bds/ng-internauta-model";
import { NtJwtLoginService } from "./nt-jwt-login.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { NTJWTModuleConfig } from "./nt-jwt-login-module-config";
import { Observable } from "rxjs";
import { PermessiEntita } from "@bds/nt-communicator";


export class UtenteUtilities {

    private utente: Utente;
    private loginConfig: NTJWTModuleConfig;
    private loginService: NtJwtLoginService;
    private http: HttpClient;

    constructor(utente: Utente, loginService: NtJwtLoginService, loginConfig: NTJWTModuleConfig, http: HttpClient) {
        this.utente = utente;
        this.loginConfig = loginConfig;
        this.loginService = loginService;
        this.http = http;
    }

    public getUtente() {
        return this.utente;
    }

    /**
     * torna le impostazioni dell'utente dell'applicazione corrente
     * (nel caso di cambio utente vengono tornate quelle dell'utente reale (del primo login))
     */
    public getImpostazioniApplicazione(): ImpostazioniApplicazioni {
        let utenteDaUsare: Utente;
        if (this.utente.utenteReale) {
            utenteDaUsare = this.utente.utenteReale;
        } else {
            utenteDaUsare = this.utente;
        }
        const impostazioniApplicazioni: ImpostazioniApplicazioni[] = utenteDaUsare.idPersona.impostazioniApplicazioniList;
        if (impostazioniApplicazioni && impostazioniApplicazioni.length === 1) {
            return impostazioniApplicazioni[0];
        } else {
            return null;
        }
    }

    public setImpostazioniApplicazione(loginService: NtJwtLoginService, impostazioniVisualizzazione: any): Observable<any> {
        let utenteDaUsare: Utente;
        if (this.utente.utenteReale) {
            utenteDaUsare = this.utente.utenteReale;
        } else {
            utenteDaUsare = this.utente;
        }
        if (!utenteDaUsare.idPersona.impostazioniApplicazioniList || utenteDaUsare.idPersona.impostazioniApplicazioniList.length === 0) {
            const impostazioni: ImpostazioniApplicazioni = new ImpostazioniApplicazioni();
            impostazioni.impostazioniVisualizzazione = JSON.stringify(impostazioniVisualizzazione);
            utenteDaUsare.idPersona.impostazioniApplicazioniList = [];
            utenteDaUsare.idPersona.impostazioniApplicazioniList.push(impostazioni);
        } else {
            // tslint:disable-next-line:max-line-length
            utenteDaUsare.idPersona.impostazioniApplicazioniList[0].impostazioniVisualizzazione = JSON.stringify(impostazioniVisualizzazione);
        }
        this.sendImpostazioniApplicazioni(impostazioniVisualizzazione).subscribe(res => {
            loginService.setLoggedUser$(this.utente, true);
            this.loginService.settingsChangedNotifier$.next(impostazioniVisualizzazione);
        });
        return this.loginService.settingsChangedNotifier$.asObservable();
    }

    private sendImpostazioniApplicazioni(impostazioniVisualizzazione: any): Observable<any> {
        const url = this.loginConfig.setImpostazioniApplicazioniUrl;
        const options = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        return this.http.post(url, impostazioniVisualizzazione, options);
    }

    public get settingsChangedNotifier$(): Observable<any> {
        return this.loginService.settingsChangedNotifier$.asObservable();
    }

    /**
     * funzione che mi dice se ho quel ruolo per quell'azienda
     * se l'azienda è null controllo se ha quel ruolo per almento un azienda
     * se viene passata l'azienda considero l'utente di quell'azienda (se esiste)
     * @param ruolo dev'essere un valore della costante CODICI_RUOLO
     * @param azienda dev'essere un codice di azienda (ad es 102, 105, ...) oppure la costanete AZIENDA_CORRENTE
    */
    public hasRole(ruolo: string, azienda?: string): boolean {
        if (ruolo === CODICI_RUOLO.CI || ruolo === CODICI_RUOLO.AS || ruolo === CODICI_RUOLO.SD) {
            // è un ruolo interaziendale
            if (this.utente.ruoliUtentiPersona && this.utente.ruoliUtentiPersona[ruolo]) {
                return true;
            } else {
                return false;
            }
        } else {
            // è un ruolo aziendale
            if (!azienda) {
                // se non passo l'azienda controllo se ha quel ruolo per un azienda qualsiasi
                if (this.utente.ruoliUtentiPersona && this.utente.ruoliUtentiPersona[ruolo]) {
                    return true;
                } else {
                    return false;
                }
            } else if (azienda === AZIENDA_CORRENTE) {
                azienda = this.utente.aziendaLogin.codice;
            }

            if (this.utente.ruoliUtentiPersona && !!this.utente.ruoliUtentiPersona[azienda]) {
                const ruoli: string[] = this.utente.ruoliUtentiPersona[azienda];
                return !!ruoli.find(e => e === ruolo);
            } else {
                return false;
            }
        }
    }

    /**
     * funzione che mi dice se il un permesso di flusso per un'azienda
     * @param codiceAzienda dev'essere un codice di azienda (ad es 102, 105, ...) oppure la costanete AZIENDA_CORRENTE
     * @param permission dev'essere un valore del enum FluxPermssion
     */
    public hasFluxPermission(codiceAzienda: string, permission: FluxPermission): boolean {

        if (codiceAzienda === AZIENDA_CORRENTE) {
            codiceAzienda = this.utente.idAzienda.codice;
        }

        const permessiESPAzienda: PermessiEntita[] = this.utente.permessiDiFlussoByCodiceAzienda[codiceAzienda];
        if (!permessiESPAzienda || permessiESPAzienda.length === 0) {
            return false;
        }

        for (const permessoEntita of permessiESPAzienda) {
            for (const categoria of permessoEntita.categorie) {
                for (const permesso of categoria.permessi) {
                    if (permesso.predicato === permission) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * funzione che mi dice se il un array di codici azienda, delle aziende dove ho il permesso di flusso passato
     * @param permission dev'essere un valore del enum FluxPermssion
     */
    public getAziendeWithPermission(permission: FluxPermission): string[] {

        const result: string[] = [];

        for (const key in CODICI_AZIENDA) {
            if (this.hasFluxPermission(CODICI_AZIENDA[key], permission)) {
                result.push(CODICI_AZIENDA[key]);
            }
        }

        return result;
    }

    /**
     * Torna i permessi pec dell'utente nel seguente formato:
     * {
     *  IdPec: [PecPermission1, PecPermission2", ...], //es. LEGGE, ELIMINA, ...
     *  ....
     * }
     */
    public getPecPermissions(): {[idPec: number]: PecPermission[]} {
        return this.getUtente().idPersona.permessiPec;
    }

    /**
     * Torna se la persona dell'utente corrente ha il permesso passato sulla pec passata
     * @param idPec la pec
     * @param pecPermission il permesso
     */
    public hasPecPermission(idPec: number, pecPermission: PecPermission): boolean {
        const pecPermissions: {[idPec: number]: PecPermission[]} = this.getPecPermissions();
        if (pecPermissions && pecPermissions[idPec]) {
            return pecPermissions[idPec].find(p => p === pecPermission) != null;
        } else {
            return false;
        }
    }

    /**
     * Torna la lista delle pec con il permesso passato
     * @param pecPermission
     */
    public getPecsWithPermission(pecPermission: PecPermission): number[] {
        const pecPermissions: {[idPec: number]: PecPermission[]} = this.getPecPermissions();
        const res: number[] = [];
        if (pecPermissions) {
            Object.keys(pecPermissions).forEach(key => {
                const idPec: number = Number(key);
                const permissions: PecPermission[] = pecPermissions[idPec];
                if (pecPermission && permissions.find(p => p === pecPermission)) {
                    res.push(idPec);
                }
            });
        }
        return res;
    }

    // DEPRECATE usare la hasRole()
    public isUG(): boolean {
        const ruoli: any[] = this.utente["ruoli"];
        return !!ruoli.find(e => e["nomeBreve"] === RUOLI[RUOLI.UG]);
    }
    public isMOS(): boolean {
        const ruoli: any[] = this.utente["ruoli"];
        return !!ruoli.find(e => e["nomeBreve"] === RUOLI[RUOLI.MOS]);
    }
    public isOS(): boolean {
        const ruoli: any[] = this.utente["ruoli"];
        return !!ruoli.find(e => e["nomeBreve"] === RUOLI[RUOLI.OS]);
    }
    public isCA(): boolean {
        const ruoli: any[] = this.utente["ruoli"];
        return !!ruoli.find(e => e["nomeBreve"] === RUOLI[RUOLI.CA]);
    }
    public isCI(): boolean {
        const ruoli: any[] = this.utente["ruoli"];
        return !!ruoli.find(e => e["nomeBreve"] === RUOLI[RUOLI.CI]);
    }
    public isAS(): boolean {
        const ruoli: any[] = this.utente["ruoli"];
        return !!ruoli.find(e => e["nomeBreve"] === RUOLI[RUOLI.AS]);
    }
    public isSD(): boolean {
        const ruoli: any[] = this.utente["ruoli"];
        return !!ruoli.find(e => e["nomeBreve"] === RUOLI[RUOLI.SD]);
    }



}

// TODO: eliminare. Usere codici ruolo nel file Ruolo.ts
enum RUOLI {
    UG = 0,
    MOS = 1,
    OS = 2,
    CA = 3,
    CI = 4,
    AS = 5,
    SD = 6,
}



