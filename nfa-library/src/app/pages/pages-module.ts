import {NgModule} from '@angular/core';
import {SharedComponentsModule} from '../shared-component-module/shared-component-module';
import {UtentiListPageComponent} from './utenti/utenti-list-page/utenti-list-page-component';
import {HomePageComponent} from './home-page/home-page-component';
import {TipiEventoListPageComponent} from './evento/tipi-evento-list-page/tipi-evento-list-page.component';
import {DominiListPageComponent} from './utenti/domini-list-page/domini-list-page.component';
import {FornitoriProdottiMdPageComponent} from './fornitori-prodotti/fornitori-prodotti-md-page.component';
import {ProdottiListPageComponent} from './prodotti/prodotti-list-page/prodotti-list-page.component';
import {ContrattiListPageComponent} from './contratti/contratti-list-page-component';
import {StatiEventoListPageComponent} from './evento/stati-evento-list-page/stati-evento-list-page.component';


/**
 * Modulo per le pagine dell'applicazione
 */
@NgModule({
  declarations: [
    UtentiListPageComponent,
    HomePageComponent,
    DominiListPageComponent,
    TipiEventoListPageComponent,
    ProdottiListPageComponent,
    FornitoriProdottiMdPageComponent,
    ContrattiListPageComponent,
      StatiEventoListPageComponent,
  ],
  imports: [
    SharedComponentsModule,
  ],
  exports: [
  ],
  entryComponents: [],
  providers: []
})
export class PagesModule {
}
