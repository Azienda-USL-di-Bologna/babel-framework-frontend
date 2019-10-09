import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
// import {ResponseDTO} from '../../../definitions/dto-definitions';
import {
    NfaAuthorizationModuleConfig, NotificationMessageSeverity, ON_LOGIN_ERROR, ON_LOGIN_USER, ON_LOGOUT_USER,
    ON_SEND_TOAST_NOTIFICATION_MESSAGE
} from '@nfa/ref';
import {ConfigurationsProvider, BroadcastProvider} from '@nfa/core';

@Injectable()
export class LoginProvider {


    constructor(protected _http: HttpClient, protected _configurationsProvider: ConfigurationsProvider,
                protected _broadcastProvider: BroadcastProvider,
                @Inject('nfaAuthorizationModuleConfig') protected config: NfaAuthorizationModuleConfig) {

    }

    public login(username: string, password: string): void {
        const loginUrl = this._configurationsProvider.getConfiguration('base-url') +
            this._configurationsProvider.getConfiguration('login-relative-url');

        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded'
        });
        const params = new HttpParams()
            .set('username', username)
            .set('password', password);
        const options = {
            headers,
            // params,
            withCredentials: true
        };
        const body = `username=${username}&password=${password}`;
        this._http.post(loginUrl, body, options).subscribe((data: any) => {
                this.manageLoginResult(data);
            },
            (error) => {
                console.error(error);
                // this.manageComunicationError(error);
            });
    }

    public logout(): void {
        const logoutUrl = this._configurationsProvider.getConfiguration('base-url') +
            this._configurationsProvider.getConfiguration('logout-relative-url');
        const options = {
            // params,
            withCredentials: true
        };
        this._http.post(logoutUrl, '', options).subscribe((data: any) => {
                this.manageLogoutResult(data);
            },
            (error) => {
                console.error(error);
                // this.manageComunicationError(error);
            });
    }

    protected manageLogoutResult(data: any) {
        this._broadcastProvider.broadcast(ON_LOGOUT_USER, null);
    }

    protected manageLoginResult(data: any) {
        const dataValue = this.config.extractDataObject(data);
        const errorValue = this.config.extractErrorObject(data);

        console.debug(JSON.stringify(data));
        if (!errorValue && dataValue !== null) {
            // se il login è andato a buon fine
            this._broadcastProvider.broadcast(ON_LOGIN_USER, dataValue);
        } else {
            this._broadcastProvider.broadcast(ON_LOGIN_ERROR, errorValue);
            if (this.config.showToastMessageOnLoginEvent) {
                this._broadcastProvider.broadcast(ON_SEND_TOAST_NOTIFICATION_MESSAGE, {
                    message: errorValue.message.value,
                    severity: NotificationMessageSeverity.ERROR
                });
            }
        }
    }

}
