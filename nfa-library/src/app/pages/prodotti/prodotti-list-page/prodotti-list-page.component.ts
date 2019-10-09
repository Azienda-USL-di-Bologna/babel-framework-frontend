import {Component, OnInit, ViewChild} from '@angular/core';
import {BaseProjectComponent} from '../../../shared-component-module/base-component/base-project-component';
import {Router} from '@angular/router';
import {FornitoreService} from '../../../services/prodotti/fornitore-service';
import {
  EntityValidations,
  extractValueDotAnnotation,
  FILTER_TYPES,
  FiltersAndSorts,
  Mode,
  PTableColumn,
  ServicePrimeNgTableSupport
} from '@nfa/next-sdr';
import {ProdottoService} from '../../../services/prodotti/prodotto-service';
import {BroadcastProvider} from '@nfa/core';
import {ProdottoValidations} from '../../../entities/validations/ProdottoValidations';
import {CustomServicePrimeNgTableSupport} from '../../../shared-component-module/framework-customizations/custom-table-support';

@Component({
  selector: 'app-prodotti-list-page.component',
  templateUrl: './prodotti-list-page.component.html',
  styleUrls: ['./prodotti-list-page.component.css']
})

export class ProdottiListPageComponent extends BaseProjectComponent implements OnInit {
  //ToDo eliminare CustomNextSdrPrimengTableSearchComponent dopo allineamento libreria

  // Array che raccolgono le definizioni per le colonne delle tabella
  public _cols: PTableColumn[];

  // oggetto di supporto per la tabella
  _tableSupport: ServicePrimeNgTableSupport;


  @ViewChild('dtProdotti') dtProdotti: any;
  @ViewChild('editDialog') editDialog: any;


  constructor(public _router: Router,
              protected fornitoreService: FornitoreService,
              protected prodottoService: ProdottoService,
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
        field : 'fornitore.descrizione',
        header: 'Fornitore',
        filterMatchMode: FILTER_TYPES.string.containsIgnoreCase,
        fieldType: 'object',
      }
    ];

    this._tableSupport = new CustomServicePrimeNgTableSupport({
      service: this.prodottoService,
      table: this.dtProdotti,
      editComponent: this.editDialog,
      projection: 'ProdottoWithFornitore',
      entityValidations: new EntityValidations([], ProdottoValidations.validate),
      onError: (error: any, mode: Mode) => {
        this.showRequestErrorMessage(error);

      }
    }, 'id');

  }

  // public extractValueFromObject(campo:string,riga:any){
  //   return extractValueDotAnnotation(campo)(riga);
  // }
}
