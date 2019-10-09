import {BaseComponentConfigurator} from './domain/base-component-configurator';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {OnDestroy, OnInit} from '@angular/core';

import {BroadcastProvider, ConfigurationsProvider} from '@nfa/core';
import {Observable} from 'rxjs';
import {NotificationMessage, NotificationMessageSeverity, ON_SEND_TOAST_NOTIFICATION_MESSAGE} from '@nfa/ref';
import {environment} from '../../../environments/environment';
import {SelectItem} from 'primeng/api';
import {
  DialogButtonType,
  DialogNotificationMessage,
  ON_SEND_DIALOG_NOTIFICATION_MESSAGE
} from '../../template/message-component/dialog-message-component/dialog-notification-message';
import {ServicePrimeNgTableSupport} from '@nfa/next-sdr';


/**
 * Classe di base che deve essere implementata da tutte i componenti del progetto
 * Contiene metodi di utilità ricorrenti
 */
export class BaseProjectComponent implements OnDestroy, OnInit {

  protected _subscriptions: Subscription[];
  protected _router: Router;
  protected _broadcastProvider: BroadcastProvider;
  protected _configurationsProvider: ConfigurationsProvider;

  constructor(baseComponentConfigurator: BaseComponentConfigurator) {
    this._subscriptions = [];
    this._router = baseComponentConfigurator.router;
    this._broadcastProvider = baseComponentConfigurator.broadcastProvider;
    this._configurationsProvider = baseComponentConfigurator.configurationsProvider;
  }

  ngOnDestroy(): void {
    // cancello le sottoscrizioni
    this._subscriptions.forEach((subscription: Subscription) => {
      if (!subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }

  ngOnInit(): void {
  }

  protected anyArrayToSelectedItemsArray(items: any[], itemValue: string ): SelectItem[] {
    return items.map(value => {
      const selectedItem: SelectItem = {
        value: value,
        label: value[itemValue],
      }
      return selectedItem;
    });
  }


  /**
   * Aggiunge sottoscrizioni che verranno chiude alla distruzione del Component
   * @param {Subscription} subscription
   */
  public addSubscriptionToUnsubscribeOnClose(subscription: Subscription) {
    this._subscriptions.push(subscription);
  }


  public goToUrl(url: String): Promise<boolean> {
    return this.getRouter().navigate([url]);
  }

  /**
   * Metodo per ottenere l'url degli assets
   * da utilizzare SOLO per gli script esterni che non tengono conto del base href dell'index.html
   * @returns {string}
   */
  public getAssetsUrlForExternal(): string {
    return environment.assets_url;
  }

  protected getRouter(): Router {
    if (this._router) {
      return this._router;
    }
  }

  /**
   * Metodo per fare il JSON.stringify ma che esclude le proprietà null e le proprietà stringe vuote ('')
   * @param object
   * @returns {string}
   */
  protected stringifyExcludeBlank(object: any): string {
    return JSON.stringify(object, (key, value) => {
      if (value !== null && ((typeof value !== 'string') || (typeof value === 'string' && value.length > 0))) {
        return value;
      }
    });
  }


  // ================ RUOLI ==================

  /**
   * Metodo che torna l'utente loggato
   */
  // public getLoggedUser(): Utente {
  //   return this._accountProvider.accountUserLogged();
  // }
  //
  // /**
  //  * metodo che torna se l'utente loggato è un admin
  //  */
  // public isLoggedAdmin(): boolean {
  //   const utente: Utente = this._accountProvider.accountUserLogged();
  //   return utente && utente.utenteRole === 'ROLE_ADMIN';
  // }

  // =================== MESSAGE =============================
  public showErrorGenericMessage(): void {
    const notificationMessage: NotificationMessage = {
      message: 'Si è verificato un errore',
      severity: NotificationMessageSeverity.ERROR
    };
    this._broadcastProvider.broadcast(ON_SEND_TOAST_NOTIFICATION_MESSAGE, notificationMessage);
  }

  public showRequestErrorMessage(reqError:any): void {

    let message = "Si è verificato un errore nella richiesta";
    let findErrorMessage = false;

    if (reqError && reqError.error && reqError.error.customError) {
      findErrorMessage = true;
    } else {
      findErrorMessage = environment.verbose_errors;
    }

    if (findErrorMessage) {
      if (reqError && reqError.error) {
        if (reqError.error.message)
          message += ": " + reqError.error.message;
        else if (reqError.error.error)
          message += ": " + reqError.error.error;
      } else {
        if (reqError && reqError.message)
          message += ": " + reqError.message;
      }
    }

    const notificationMessage: DialogNotificationMessage = {
      message: message,
      severity: NotificationMessageSeverity.ERROR,
      buttons: [{caption: 'OK', type: 'SUCCESS'}]
    };
    this._broadcastProvider.broadcast(ON_SEND_DIALOG_NOTIFICATION_MESSAGE, notificationMessage);
  }

    public askBeforeDelete(_tableSupport:ServicePrimeNgTableSupport, entity:any, entityName?:string, message?:string){
        let myMessage = message;
        if(!myMessage){
            myMessage= entityName ? '"'+entityName+'" verrà eliminata\\o': 'L\'entità verrà eliminata\\o';
            myMessage += ' Come desideri procedere ?';
            myMessage= myMessage.charAt(0).toUpperCase() +  myMessage.slice(1);
        }
        const dialog: DialogNotificationMessage = {
            buttons: [ {caption : 'Annulla' , type : 'SECONDARY', callback: () => {console.log('exit');}},
                {caption : 'Elimina ' , type : 'SUCCESS', callback: () => {_tableSupport.deleteAndSubscribe(entity); }}],
            message: myMessage,
            severity: NotificationMessageSeverity.WARNING,
        };
        this._broadcastProvider.broadcast(ON_SEND_DIALOG_NOTIFICATION_MESSAGE, dialog);
    }
  // public showLoadingPopupDefault(subscription: Subscription) {
  //   if (this._broadcastProvider) {
  //     const nfaLoadingPopup: NfaLoadingPopup = {subscription: subscription};
  //     this._broadcastProvider.broadcast(ON_SHOW_LOADING_POPUP, nfaLoadingPopup);
  //   }
  // }

  // ================= DEFAULT VALUES ===========================

  // map key
  // public get MAP_KEYS(): any {
  //   const keys = {
  //     google: this._configurationsProvider.getConfiguration()
  //   }
  //   //{google: 'AIzaSyCuH8TAEcD3epb9Wmz9D_TyZASceYofSRI'}
  //
  // }

  /**
   * Da implementare in ogni tabella crud sostituisce il messaggio di errore di default
   * @param event
   */
  public onDataErrorOccurredDefault(event: any): void {
    if (event && event.error) {
      event.error.message = '    Si è verificato un errore';
    }
  }


}
