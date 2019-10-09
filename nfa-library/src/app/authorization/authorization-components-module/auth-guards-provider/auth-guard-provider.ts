import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import {AccountProvider} from '@nfa/authorization';
import {BroadcastProvider} from '@nfa/core';
import {NotificationMessage, NotificationMessageSeverity, ON_SEND_TOAST_NOTIFICATION_MESSAGE} from '@nfa/ref';
import {Observable} from 'rxjs';

@Injectable()
export class AuthGuardProvider implements CanActivate {

  constructor(
    protected _accountProvider: AccountProvider,
    protected _router: Router,
    protected _broadcastProvider: BroadcastProvider,
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this._accountProvider.accountUserLogged() !== null) {
      const utenteRole: any = this._accountProvider.accountUserLogged().utenteRole;
      const utente: any = this._accountProvider.accountUserLogged();
      if (next.data.roles.indexOf(utenteRole) > -1) {
        return true;
      }
    }
    this.showWarningUnAuthorize();
    return false;
  }

  public showWarningUnAuthorize(): void {
    const notificationMessage: NotificationMessage = {
      message: 'Non hai i permessi per visualizzare la pagina',
      severity: NotificationMessageSeverity.WARNING
    };
    this._broadcastProvider.broadcast(ON_SEND_TOAST_NOTIFICATION_MESSAGE, notificationMessage);
  }

}
