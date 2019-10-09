import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BaseProjectComponent} from '../../shared-component-module/base-component/base-project-component';
import {MenuItem} from 'primeng/api';
import {HOME_PAGE_URL, UTENTI_LIST_URL} from '../../constants/app-urls';
import {ON_ACCOUNT_USER_LOGGED, ON_ACCOUNT_USER_REMOVED} from '@nfa/ref';
import {BroadcastProvider} from '@nfa/core';
import {LoginResultDTO, RuoloPerDominioDTO} from '../../entities/LoggedUserInfo';
import {Log} from '@angular/core/testing/src/logger';
import {ON_TOGGLED_MENU, ON_USER_ROLE_NEW_SELECTION, ON_USER_ROLE_SELECTED} from '../../constants/app-events-keys';

@Component({
  selector: 'app-main-template-component',
  templateUrl: './main-template-component.html',
  // styleUrls: ['./dettaglio-provvedimento.component.css']
})
export class MainTemplateComponent extends BaseProjectComponent implements OnInit {

  // se non si visualizza niente potrebbe esser la causa questo flag
  _readyToRender = false;
  _accountUserLogged: boolean;
  _accountUserRoleSelected: boolean;
  _expandedMenu = true;
  _userData: LoginResultDTO;


  constructor(public _router: Router, protected _broadcastProvider: BroadcastProvider) {
    super({router: _router});
  }

  ngOnInit(): void {
    this._accountUserLogged = false;
    this.registerAccountEvent();
  }

  protected registerAccountEvent(): void {
    this._broadcastProvider.on(ON_ACCOUNT_USER_LOGGED).subscribe( value => {
      this._accountUserLogged = true;
      this._readyToRender = true;
      this._userData = value as LoginResultDTO;
      this._accountUserRoleSelected = this._userData.ruoloPerDominioDTO != null;
      console.log(this._userData);
    });
    this._broadcastProvider.on(ON_ACCOUNT_USER_REMOVED).subscribe(value => {
      this._accountUserLogged = false;
      this._readyToRender = true;
      this._accountUserRoleSelected = false;
      this._userData = null;
    });
    this._broadcastProvider.on(ON_USER_ROLE_SELECTED).subscribe( value => {
      this._accountUserLogged = true;
      this._readyToRender = true;
      this._accountUserRoleSelected = true;
      this._userData.ruoloPerDominioDTO = value as RuoloPerDominioDTO;
      console.log(this._userData);
    });
    this._broadcastProvider.on(ON_USER_ROLE_NEW_SELECTION).subscribe( value => {
      this._accountUserLogged = true;
      this._readyToRender = true;
      this._accountUserRoleSelected = false
      this._userData.ruoloPerDominioDTO = null;
    });
    this._broadcastProvider.on(ON_TOGGLED_MENU).subscribe((value:boolean) => {
      this._expandedMenu = value;
    });
  }


}
