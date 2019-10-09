import {NgModule} from '@angular/core';
import {SharedComponentsModule} from '../shared-component-module/shared-component-module';
import {UtenteService} from './utenti/utente-service';
import {DatePipe} from '@angular/common';
import {MessageService} from 'primeng/api';
import {DominioService} from './utenti/dominio-service';
import {TipoEventoService} from './eventi/tipo-evento-service';
import {ProdottoService} from './prodotti/prodotto-service';
import {FornitoreService} from './prodotti/fornitore-service';
import {ContrattiService} from './contratti/contratti-service';
import {StatoEventoService} from './eventi/stato-evento-service';


/**
 * Modulo per i services dell'applicazione
 */
@NgModule({
  declarations: [
  ],
  imports: [
    SharedComponentsModule,
  ],
  exports: [
  ],
  entryComponents: [],
  providers: [DatePipe, MessageService, UtenteService, DominioService, TipoEventoService, ProdottoService,
      FornitoreService, ContrattiService , StatoEventoService]
})

export class ServicesModule {
}
