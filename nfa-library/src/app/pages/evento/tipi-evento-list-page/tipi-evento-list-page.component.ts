import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {BaseProjectComponent} from '../../../shared-component-module/base-component/base-project-component';
import {TipoEventoService} from '../../../services/eventi/tipo-evento-service';
import {BroadcastProvider} from '@nfa/core';
import {FILTER_TYPES, PTableColumn, ServicePrimeNgTableSupport} from '@nfa/next-sdr';
import {MessageService} from 'primeng/api';


@Component({
  selector: 'app-tipi-evento-list-page.component',
  templateUrl: './tipi-evento-list-page.component.html',
  styleUrls: ['./tipi-evento-list-page.component.css']
})
export class TipiEventoListPageComponent extends BaseProjectComponent implements OnInit {

  // Array che raccolgono le definizioni per le colonne delle tabella
  public _cols: PTableColumn[];

  // oggetto di supporto per la tabella
  _tableSupport: ServicePrimeNgTableSupport;


  @ViewChild('dtTipiEvento') dtTipiEvento: any;
  @ViewChild('editComponent') editDialog: any;
@ViewChild('dialog') dialog : any;

  constructor(public _router: Router,
              public tipoEventoService: TipoEventoService,
              protected broadcaster:BroadcastProvider,
              public messageService:MessageService
  ) { super({router: _router}); }

  ngOnInit() {
    this._cols = [
      {
        field: 'descrizione',
        header: 'Tipo Evento',
        filterMatchMode: FILTER_TYPES.string.containsIgnoreCase,
        fieldType: 'string'
      }

    ];

    this._tableSupport = new ServicePrimeNgTableSupport({
      service: this.tipoEventoService,
      table: this.dtTipiEvento,
      editComponent: this.editDialog,
    });

  }
  startEdit(){
      this.dialog.visible = true;
  }
  finishEdit(){
      this.dialog.visible = false;
  }


}
