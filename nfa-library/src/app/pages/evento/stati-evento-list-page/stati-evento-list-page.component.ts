import {Component, OnInit, ViewChild} from '@angular/core';
import {EntityValidations, FILTER_TYPES, Mode, PTableColumn, ServicePrimeNgTableSupport} from '@nfa/next-sdr';
import {BroadcastProvider} from '@nfa/core';
import {Router} from '@angular/router';
import {TipoEventoService} from '../../../services/eventi/tipo-evento-service';
import {StatoEventoService} from '../../../services/eventi/stato-evento-service';
import {BaseProjectComponent} from '../../../shared-component-module/base-component/base-project-component';
import {CustomServicePrimeNgTableSupport} from '../../../shared-component-module/framework-customizations/custom-table-support';

@Component({
  selector: 'app-stati-evento-list-page',
  templateUrl: './stati-evento-list-page.component.html',
  styleUrls: ['./stati-evento-list-page.component.css']
})
export class StatiEventoListPageComponent extends BaseProjectComponent implements OnInit {
  public _cols: PTableColumn[];

  // oggetto di supporto per la tabella
  _tableSupport: ServicePrimeNgTableSupport;
  searching:boolean;
  _emptyStato = {
    descrizione:'Alfa',
    statoEventoDefault:false,
    pubblicato:false,
    tipoEvento:null

  };

  @ViewChild('dtStati') dtStati: any;
  @ViewChild('editDialog') editDialog: any;


  constructor(public _router: Router,
              protected statoService: StatoEventoService,
              protected tipoService: TipoEventoService,
              protected broadcaster: BroadcastProvider) {
    super({router: _router});
    this._broadcastProvider = broadcaster;
  }
  ngOnInit() {
    this._cols = [
      {
        field: 'descrizione',
        header: 'Descrizione',
        filterMatchMode: FILTER_TYPES.string.containsIgnoreCase,
        fieldType: 'string',
      },
      {
        field: 'pubblicato',
        header: 'Pubblicato',
        filterMatchMode: FILTER_TYPES.not_string.equals,
        fieldType: 'boolean',
      },
      {
        field: 'statoEventoDefault',
        header: 'Default Stato',
        filterMatchMode: FILTER_TYPES.not_string.equals,
        fieldType: 'boolean',
      },
      {
        field: 'tipoEvento.descrizione',
        header: 'Tipo Evento',
        filterMatchMode: FILTER_TYPES.string.containsIgnoreCase,
        fieldType: 'object',
      }
    ];

    this._tableSupport = new ServicePrimeNgTableSupport({
      service: this.statoService,
      table: this.dtStati,
      editComponent: this.editDialog,
       projection: 'StatoEventoWithTipoEvento',
      // entityValidations: new EntityValidations([], ProdottoValidations.validate),
    //   onError: (error: any, mode: Mode) => {
    //     this.showRequestErrorMessage(error);
    //
    //   }
     }
    );

  }
  public toogleSearch () {
    this.searching = !this.searching;
    this._tableSupport.refreshAndResetFilters();

  }

}
