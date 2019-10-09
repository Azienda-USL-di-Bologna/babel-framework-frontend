import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BaseProjectComponent} from '../../shared-component-module/base-component/base-project-component';
import {MenuItem, SelectItem} from 'primeng/api';
import {LoginProvider} from '@nfa/authorization';
import {DOMINI_LIST_URL, HOME_PAGE_URL, UTENTI_LIST_URL} from '../../constants/app-urls';
import {Dominio} from '../../entities/Dominio';
import {DominioService} from '../../services/utenti/dominio-service';
import {FiltersAndSorts} from '@bds/nt-communicator';
import {AccountProvider} from '@nfa/authorization';
import {BroadcastProvider} from '@nfa/core';

import {LoginResultDTO, RuoloPerDominioDTO, UtenteRole, UtenteRoleType} from '../../entities/LoggedUserInfo';
import {NotificationMessageSeverity, ON_ACCOUNT_USER_LOGGED, ON_SEND_TOAST_NOTIFICATION_MESSAGE} from '@nfa/ref';
import {ON_USER_ROLE_SELECTED} from '../../constants/app-events-keys';

@Component({
  selector: 'app-domini-selection-component',
  templateUrl: './domini-selection-component.html',
  // styleUrls: ['./dettaglio-provvedimento.component.css']
})
export class DominiSelectionComponent extends BaseProjectComponent implements OnInit {

  public domini: SelectItem[];
  public selectedDominio;

  constructor(public _router: Router,
              protected _loginProvider: LoginProvider,
              protected _dominioService:DominioService,
              protected _accountProvider:AccountProvider,
              protected _broadcastProvider:BroadcastProvider,

  ) {
    super({router: _router, broadcastProvider: _broadcastProvider});

  }


  ngOnInit(): void {
    this.getDomini();

    /*this._broadcastProvider.on(ON_ACCOUNT_USER_LOGGED).subscribe( value => {
      this.getDomini();
    });*/
  }

  public getDomini(){
    const loggedUserInfo:LoginResultDTO = this._accountProvider.accountUserLogged();
    this.domini = super.anyArrayToSelectedItemsArray(loggedUserInfo.ruoliPerDominioDTODisponibili, 'id');
    if (this.domini.length === 0){
      this._broadcastProvider.broadcast(ON_SEND_TOAST_NOTIFICATION_MESSAGE, {
        title: 'Attenzione',
        message: 'Non è stato assegnato nessun ruolo/dominio alla tua utenza. Rivolgersi ad un amministratore di sistema.',
        severity: NotificationMessageSeverity.WARNING
      });
    }
  }

  public GetRoleName(roleType:UtenteRoleType){
    return UtenteRole.GetRoleName(roleType);
  }

  public selectDominio(){
    if (this.selectedDominio) {

      this._dominioService.selectDomainRole(this.selectedDominio)
        .subscribe(
          data => {

            const loggedUserInfo: LoginResultDTO = this._accountProvider.accountUserLogged();
            loggedUserInfo.ruoloPerDominioDTO = this.selectedDominio;
            this._accountProvider.updateAccount(loggedUserInfo);

            const loggedUserInfoTest: LoginResultDTO = this._accountProvider.accountUserLogged();

            this._broadcastProvider.broadcast(ON_USER_ROLE_SELECTED, this.selectedDominio);
            this._broadcastProvider.broadcast(ON_SEND_TOAST_NOTIFICATION_MESSAGE, {
              title: 'Ruolo Selezionato',
              message: 'Il nuovo ruolo/dominio è stato selezionato',
              severity: NotificationMessageSeverity.SUCCESS
            });
          },
          err => {
            console.log('error', err)
            const errorMsg = (err.error) ? err.error : "Errore durante l'operazione";

            this._broadcastProvider.broadcast(ON_SEND_TOAST_NOTIFICATION_MESSAGE, {
              title: 'Errore',
              message: errorMsg,
              severity: NotificationMessageSeverity.ERROR
            });
          });
    } else {
      this._broadcastProvider.broadcast(ON_SEND_TOAST_NOTIFICATION_MESSAGE, {
        title: 'Attenzione',
        message: 'Selezionare un ruolo / dominio valido',
        severity: NotificationMessageSeverity.WARNING
      });
    }

  }

  public logout(): void {
    this._loginProvider.logout();
  }
}
