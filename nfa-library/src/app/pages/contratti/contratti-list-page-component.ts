import {BaseProjectComponent} from '../../shared-component-module/base-component/base-project-component';
import {Component, OnInit, ViewChild} from '@angular/core';
import {BroadcastProvider} from '@nfa/core';
import {Router} from '@angular/router';
import {UtenteService} from '../../services/utenti/utente-service';
import {MessageService} from 'primeng/api';
import {DominioService} from '../../services/utenti/dominio-service';
import {ContrattiService} from '../../services/contratti/contratti-service';
import {EntityValidations, extractValueDotAnnotation, FILTER_TYPES, Mode, PTableColumn, ServicePrimeNgTableSupport} from '@nfa/next-sdr';
import {CustomServicePrimeNgTableSupport} from '../../shared-component-module/framework-customizations/custom-table-support';
import {UtenteValidations} from '../../entities/validations/UtenteValidations';
import {FornitoreService} from '../../services/prodotti/fornitore-service';
import {
    FilterDefinition, FiltersAndSorts
} from '@nfa/next-sdr';

@Component({
  selector: 'app-contratti-list-page-component',
  templateUrl: './contratti-list-page-component.html',
  // styleUrls: ['./dettaglio-provvedimento.component.css']
})
export class ContrattiListPageComponent extends BaseProjectComponent implements OnInit {

  // Array che raccolgono le definizioni per le colonne delle tabelle di contratti
  public _cols: PTableColumn[];

  // Oggetti di supporto per le tabelle di utenti e ruoli
  _contrattiTableSupport: CustomServicePrimeNgTableSupport;

  @ViewChild('dtContratti') dtContratti: any;
  @ViewChild('editComponent') editComponent: any;
 @ViewChild(' utenteAutoComplete') utenteAutoComplete: any;
  public dominioFilter: FiltersAndSorts;

  constructor(public _router: Router,
              protected utenteService: UtenteService,
              protected contrattiService: ContrattiService,
              protected dominioService: DominioService,
              protected fornitoreService: FornitoreService,
              protected broadcaster: BroadcastProvider,
              public messageService: MessageService) {
    super({router: _router});
    this._broadcastProvider = broadcaster;
  }

  ngOnInit() {
      this.dominioFilter = new FiltersAndSorts();
      this.dominioFilter.addFilter(new FilterDefinition('ruoliPerDomini.dominio.id', FILTER_TYPES.not_string.equals , 2));
      console.log(this.dominioFilter);
      console.log(this.utenteAutoComplete);
    this._cols = [
      {
        field: 'oggetto',
        header: 'Oggetto',
        filterMatchMode: FILTER_TYPES.string.containsIgnoreCase,
        fieldType: 'string',
      },
      {
        field: 'dataNominaDEC',
        header: 'Data Nomina DEC',
        filterMatchMode: FILTER_TYPES.not_string.equals,
        fieldType: 'Date',
        format: {viewFormat: 'dd MMM yyyy', calendarFormat: 'dd M yy'}
      },
      {
        field: extractValueDotAnnotation('fornitore.descrizione'),
        header: 'Fornitore',
        filterMatchMode: FILTER_TYPES.not_string.equals,
        fieldType: 'object',
      },
      {
        field: extractValueDotAnnotation('dominio.descrizione'),
        header: 'Dominio',
        filterMatchMode: FILTER_TYPES.not_string.equals,
        fieldType: 'object',
      },
      {
        field: (contratto:any) => contratto.utenteDEC.nome + ' ' + contratto.utenteDEC.cognome,
        header: 'Utente DEC',
        filterMatchMode: FILTER_TYPES.not_string.equals,
        fieldType: 'object',
      }
    ];

    this._contrattiTableSupport = new CustomServicePrimeNgTableSupport({
      service: this.contrattiService,
      projection: 'ContrattoWithDominioAndFornitoreAndUtenteDEC',
      table: this.dtContratti,
      editComponent: this.editComponent,
      entityValidations: new EntityValidations([], UtenteValidations.validate),
      onError: (error: any, mode: Mode) => {
        this.showRequestErrorMessage(error);
      }
    }, 'id');
  }

  onCalendarTest(event: any){
    console.log("scelta data",event)
    if (event.srcElement !== undefined){
      if (event.srcElement.value && event.srcElement.value != null) {
        return;
        /*try {
          const date = new Date(event.srcElement.value);
          event = date;
        } catch (e){}*/
      } else {
        this.dtContratti.filter([], 'dataNominaDEC', '=<');
      }
    }

    const testArray = [];
    testArray.push(event);
    this.dtContratti.filter(testArray, 'dataNominaDEC', '=<');
  }

  onCalendarCloseTest(event: any){
    const a = '';
  }

    onCalendarClearTest(event: any){
        console.log('clear',event.srcElement.value);
    }
    dominioSelezionato(event) {
      console.log(event.id);
      const idDominio = event.id;
      this.dominioFilter = new FiltersAndSorts();
      this.dominioFilter.addFilter(new FilterDefinition('ruoliPerDomini.dominio.id', FILTER_TYPES.not_string.equals , idDominio));
      this.editComponent._entity.utenteDEC = null;
      console.log(this.dominioFilter);
      console.log(this.editComponent);
    }
}
