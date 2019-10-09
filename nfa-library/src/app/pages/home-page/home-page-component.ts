import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BaseProjectComponent} from '../../shared-component-module/base-component/base-project-component';
import {BroadcastProvider} from '@nfa/core';
import {NotificationMessageSeverity, ON_SEND_TOAST_NOTIFICATION_MESSAGE} from '@nfa/ref';
import {LoginResultDTO, UtenteRole} from '../../entities/LoggedUserInfo';
import {AccountProvider} from '@nfa/authorization';
import {ON_USER_ROLE_NEW_SELECTION, ON_USER_ROLE_SELECTED} from '../../constants/app-events-keys';

@Component({
  selector: 'app-home-page-component',
  templateUrl: './home-page-component.html',
  // styleUrls: ['./dettaglio-provvedimento.component.css']
})
export class HomePageComponent extends BaseProjectComponent implements OnInit {

  constructor(
              public _router: Router,
              protected  _broadcastProvider: BroadcastProvider,
              protected _accountProvider:AccountProvider
  ) {
    super({router: _router, broadcastProvider: _broadcastProvider});
  }

  showCurrentSelectedRole(){

    const loggedUserInfo:LoginResultDTO = this._accountProvider.accountUserLogged();
    const currRole = (loggedUserInfo.ruoloPerDominioDTO.idDominio ? (loggedUserInfo.ruoloPerDominioDTO.descrizioneDominio + ' - ') : '')
      + UtenteRole.GetRoleName(loggedUserInfo.ruoloPerDominioDTO.utenteRole);

    this._broadcastProvider.broadcast(ON_SEND_TOAST_NOTIFICATION_MESSAGE, {
      title:'Ruolo Selezionato',
      message: 'Il Ruolo Attuale è il seguente: '+currRole,
      severity: NotificationMessageSeverity.SUCCESS} );
  }

  changeRole(){
    this._broadcastProvider.broadcast(ON_USER_ROLE_NEW_SELECTION, null);
  }

}
