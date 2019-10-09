import {Component, Input, OnInit} from '@angular/core';
import {BroadcastProvider} from '@nfa/core';
import {ON_TOGGLED_MENU} from '../../constants/app-events-keys';
import {LoginProvider} from '@nfa/authorization';
import {LoginResultDTO, UtenteRole, UtenteRoleType} from '../../entities/LoggedUserInfo';

@Component({
  selector: 'app-toolbar-component',
  templateUrl: './toolbar-component.html',
  styleUrls: ['./toolbar-component.css']
})
export class ToolbarComponent implements OnInit {

  @Input() menuExpanded: boolean;
  @Input() loggedUser: LoginResultDTO;



  constructor(private broadCaster:BroadcastProvider, protected _loginProvider: LoginProvider) { }

  ngOnInit() {
    console.log(this.menuExpanded);
  }

  public logout(): void {
    this._loginProvider.logout();
  }

  protected toggleMenu(): void{

    this.menuExpanded = ! (this.menuExpanded);
    console.log(this.menuExpanded);
    // avviso il padre
    this.broadCaster.broadcast(ON_TOGGLED_MENU,this.menuExpanded);
  }

  protected decodeUserRole(): string{

    let ruoloPerDominio: string = "";
    ruoloPerDominio = UtenteRole.GetRoleName(this.loggedUser.ruoloPerDominioDTO.utenteRole) + " - "
      + this.loggedUser.ruoloPerDominioDTO.descrizioneDominio;

    return ruoloPerDominio;

  }
}
