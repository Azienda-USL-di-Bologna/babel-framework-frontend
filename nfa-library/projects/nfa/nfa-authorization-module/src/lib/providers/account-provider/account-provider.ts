import {Inject, Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {
    NfaAuthorizationModuleConfig, NotificationMessageSeverity,
    ON_401_RESPONSE, ON_ACCOUNT_USER_LOGGED, ON_ACCOUNT_USER_REMOVED, ON_LOGIN_USER,
    ON_LOGOUT_USER, ON_ACCOUNT_USER_UPDATED, ON_SEND_TOAST_NOTIFICATION_MESSAGE
} from '@nfa/ref';

import {BroadcastProvider, ConfigurationsProvider} from '@nfa/core';


@Injectable()
export class AccountProvider {

    public ACCOUNT_LOCAL_STORAGE_KEY: string;

    constructor(protected _httpClient: HttpClient, protected _configurationsProvider: ConfigurationsProvider,
                protected _broadcastProvider: BroadcastProvider,
                @Inject('nfaAuthorizationModuleConfig') protected config: NfaAuthorizationModuleConfig) {
        this.registerOnLoginEvent();
        this.registerOnLogoutEvent();
        this.registerOn401Response();
        this.reloadInfoFromBackend();
        this.ACCOUNT_LOCAL_STORAGE_KEY = _configurationsProvider.getConfiguration('account-local-storage-key');

    }


    /**
     * Registra l'utente loggato
     * @param loginInfo
     */
    public registerAccount(loginInfo: any): void {
        localStorage.setItem(this.ACCOUNT_LOCAL_STORAGE_KEY, JSON.stringify(loginInfo));
        this._broadcastProvider.broadcast(ON_ACCOUNT_USER_LOGGED, loginInfo);
        if (this.config.showToastMessageOnLoginEvent) {
            // mando il messaggio di login
            this._broadcastProvider.broadcast(ON_SEND_TOAST_NOTIFICATION_MESSAGE,
              {message: 'Utente ' + this.config.extractUserIdentifier(loginInfo) +
                      ' autenticato', severity: NotificationMessageSeverity.SUCCESS});
        }

    }

    /**
     * Aggiorna l'utente loggato e poi lancia l'evento ON_ACCOUNT_USER_UPDATED
     * @param loginInfo
     */
    public updateAccount(loginInfo: any): void {
        localStorage.setItem(this.ACCOUNT_LOCAL_STORAGE_KEY, JSON.stringify(loginInfo));
        this._broadcastProvider.broadcast(ON_ACCOUNT_USER_UPDATED, loginInfo);
    }

    /**
     * Rimuove l'utente loggato (ormai sloggato)
     */
    public removeAccount(): void {
        localStorage.setItem(this.ACCOUNT_LOCAL_STORAGE_KEY, null);
        this._broadcastProvider.broadcast(ON_ACCOUNT_USER_REMOVED, null);
        if (this.config.showToastMessageOnLoginEvent) {
            // mando messaggio di logout
            this._broadcastProvider.broadcast(ON_SEND_TOAST_NOTIFICATION_MESSAGE,
                {message: 'Utente Disconnesso', severity: NotificationMessageSeverity.SUCCESS});
        }

    }

    protected registerOnLoginEvent(): void {
        this._broadcastProvider.on(ON_LOGIN_USER).subscribe((loginInfo: any) => {
            this.registerAccount(loginInfo);
        });
    }

    protected registerOnLogoutEvent(): void {
        this._broadcastProvider.on(ON_LOGOUT_USER).subscribe((loginInfo: any) => {
            this.removeAccount();
        });
    }


    protected registerOn401Response(): void {
        this._broadcastProvider.on(ON_401_RESPONSE).subscribe((value: any) => {
            this.removeAccount();
        });
    }

    // protected registerOn500Response(): void {
    //   this._broadcastProvider.on(ON_500_RESPONSE).subscribe(value => {
    //     // this._broadcastProvider.broadcast(ON_SEND_TOAST_NOTIFICATION_MESSAGE,
    //     //   {message: 'Si è verificato un errore', severity: NotificationMessageSeverity.ERROR});
    //   });
    // }

    /**
     * Ritorna le informazioni circa l'utente loggato
     */
    public accountUserLogged(): any {
        if (localStorage.getItem(this.ACCOUNT_LOCAL_STORAGE_KEY)) {
            return JSON.parse(localStorage.getItem(this.ACCOUNT_LOCAL_STORAGE_KEY));
        }
        return null;
    }


    protected reloadInfoFromBackend(): void {
        const url = this._configurationsProvider.getConfiguration('base-url') +
            this._configurationsProvider.getConfiguration('utente-me-relative-url');
        this._httpClient.get(url).subscribe((value: any) => {
            if (!this.config.extractErrorObject(value) && this.config.extractDataObject(value)) {
                this.registerAccount(this.config.extractDataObject(value));
            }
        });
    }


}
