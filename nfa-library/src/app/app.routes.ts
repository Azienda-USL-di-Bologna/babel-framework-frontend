import {Routes} from '@angular/router';
import {CONTRATTI_LIST_URL,
    DOMINI_LIST_URL, FORNITORI_LIST_URL, HOME_PAGE_URL, PRODOTTI_LIST_URL, TIPI_EVENTO_LIST_URL,
     STATI_EVENTO_LIST_URL, UTENTI_LIST_URL
} from './constants/app-urls';
import {UtentiListPageComponent} from './pages/utenti/utenti-list-page/utenti-list-page-component';
import {HomePageComponent} from './pages/home-page/home-page-component';
import {TipiEventoListPageComponent} from './pages/evento/tipi-evento-list-page/tipi-evento-list-page.component';
import {DominiListPageComponent} from './pages/utenti/domini-list-page/domini-list-page.component';
import {ProdottiListPageComponent} from './pages/prodotti/prodotti-list-page/prodotti-list-page.component';
import {FornitoriProdottiMdPageComponent} from './pages/fornitori-prodotti/fornitori-prodotti-md-page.component';
import {ContrattiListPageComponent} from './pages/contratti/contratti-list-page-component';
import {StatiEventoListPageComponent} from './pages/evento/stati-evento-list-page/stati-evento-list-page.component';


export const rootRouterConfig: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: HOME_PAGE_URL,
  //  canActivate: [AuthGuardProvider],
  //  data: {roles: ['ROLE_ADMIN', 'ROLE_EDITOR', 'ROLE_AZIENDA_EDITOR']}

  },
  {
    path: HOME_PAGE_URL,
    component: HomePageComponent,
  },
  {
    path: UTENTI_LIST_URL,
    component: UtentiListPageComponent,
  },
  {
    path: DOMINI_LIST_URL,
    component: DominiListPageComponent,
  },
  {
    path: TIPI_EVENTO_LIST_URL,
    component: TipiEventoListPageComponent,
  },
    {
        path: STATI_EVENTO_LIST_URL,
        component: StatiEventoListPageComponent,
    },
  {
     path: PRODOTTI_LIST_URL,
     component: ProdottiListPageComponent,
   },
  {
    path: FORNITORI_LIST_URL,
    component: FornitoriProdottiMdPageComponent,
  },
    {
        path: CONTRATTI_LIST_URL,
        component: ContrattiListPageComponent,
    },

];




