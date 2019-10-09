import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BaseProjectComponent} from '../../shared-component-module/base-component/base-project-component';
// import {TieredMenuModule} from 'primeng/tieredmenu';
import {MenuItem} from 'primeng/api';
import {LoginProvider} from '@nfa/authorization';
import {
    CONTRATTI_LIST_URL,
    DOMINI_LIST_URL,
    FORNITORI_LIST_URL,
    HOME_PAGE_URL,
    PRODOTTI_LIST_URL, STATI_EVENTO_LIST_URL,
    TIPI_EVENTO_LIST_URL,
    UTENTI_LIST_URL
} from '../../constants/app-urls';

@Component({
  selector: 'app-menu-component',
  templateUrl: './menu-component.html',
  // styleUrls: ['./dettaglio-provvedimento.component.css']
})
export class MenuComponent extends BaseProjectComponent implements OnInit {

  menuItems: MenuItem[];

  constructor(public _router: Router, protected _loginProvider: LoginProvider) {
    super({router: _router});
    this.menuItems = MENU_ITEMS;
  }

  ngOnInit(): void {

  }

}


export const MENU_ITEMS: MenuItem[] = [
  {
    label: 'Home',
    icon: 'fa fa-home',
    items:[
      {
        label: 'Home',
        icon: 'fa fa-home',
        routerLink: HOME_PAGE_URL,
      }
    ]
  },
  {
    label: 'Anagrafiche',
    icon:'fa fa-android',
    items:[
      {
        label: 'Utenti',
        icon: 'fa fa-users',
        routerLink: UTENTI_LIST_URL,
      },
      {
        label: 'Domini',
        icon: 'fa fa-mortar-board',
        routerLink: DOMINI_LIST_URL,
      },
      {
        label: 'Tipi Evento',
        icon: 'fa fa-bullseye',
        routerLink: TIPI_EVENTO_LIST_URL,
      },
        {
            label: 'Stati Evento',
            icon: 'fa fa-bullseye',
            routerLink: STATI_EVENTO_LIST_URL,
        },
      {
        label: 'Prodotti',
        icon: 'fa fa-diamond',
        routerLink: PRODOTTI_LIST_URL,
      },
      {
        label: 'Fornitori',
        icon: 'fa fa-truck',
        routerLink: FORNITORI_LIST_URL,
      },
        {
          label: 'Contratti',
            routerLink: CONTRATTI_LIST_URL,
        }
    ]

  },


];


