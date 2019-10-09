import {Component, OnInit, ViewChild} from '@angular/core';
import {FornitoreService} from '../../services/prodotti/fornitore-service';
import {ProdottoService} from '../../services/prodotti/prodotto-service';
import {BaseProjectComponent} from '../../shared-component-module/base-component/base-project-component';
import {Router} from '@angular/router';
import {
    EntityValidations, FILTER_TYPES, FilterDefinition, FiltersAndSorts, Mode, PTableColumn,
    ServicePrimeNgTableSupport
} from '@nfa/next-sdr';
import {FornitoreValidations} from '../../entities/validations/FornitoreValidations';
import {BroadcastProvider, ConfigurationsProvider} from '@nfa/core';

@Component({
    selector: 'app-fornitori-prodotti-md-page',
    templateUrl: './fornitori-prodotti-md-page.component.html',
    styleUrls: ['./fornitori-prodotti-md-page.component.css']
})
export class FornitoriProdottiMdPageComponent extends BaseProjectComponent implements OnInit {
    public _colsMaster: PTableColumn[];
    public _fornitoriTableSupport: ServicePrimeNgTableSupport;
    public _colsDetail: PTableColumn[];
    _prodottiTableSupport: ServicePrimeNgTableSupport;
    public idFornitoreSelezionato = 0;
    private editing: boolean;
    public filterProdottiObj = {};
    @ViewChild('dtFornitori') dtFornitori: any;
    @ViewChild('editFornitore') editDialog: any;
    @ViewChild('dtProdotti') dtProdotti: any;

    constructor(public _router: Router, public fornitoreService: FornitoreService, public prodottoService: ProdottoService,public broadCaster:BroadcastProvider) {
        super({router: _router});
        this._broadcastProvider=broadCaster;

    }

    ngOnInit() {
        this._colsMaster = [
            {
                field: 'descrizione',
                header: 'Fornitore',
                filterMatchMode: FILTER_TYPES.string.containsIgnoreCase,
                fieldType: 'string'
            }

        ];
        this._colsDetail = [
            {
                field: 'descrizione',
                header: 'Prodotto',
                filterMatchMode: FILTER_TYPES.string.containsIgnoreCase,
                fieldType: 'string'
            }

        ];
        for (let i = 0; i < this._colsDetail.length; i++) {
            const myfield = this._colsDetail[i].field;
            console.log(myfield);
            this.filterProdottiObj['' + myfield] = '';
        }
        this._fornitoriTableSupport = new ServicePrimeNgTableSupport({
            service: this.fornitoreService,
            table: this.dtFornitori,
            editComponent: this.editDialog,
            registerTableSelectEditEvents: false,
            entityValidations: new EntityValidations([], FornitoreValidations.validate),
            afterLoad: (result) => {
                console.log(result);
                this.loadedData();
            },
            onError: (error: any, mode: Mode) => {
                this.showRequestErrorMessage(error);
            },
            onAfterDelete : (entity) => {
                console.log(entity);
                this.idFornitoreSelezionato = 0;
                const filtro = new FiltersAndSorts();
                filtro.addFilter(new FilterDefinition('fornitore.id', FILTER_TYPES.not_string.equals, this.idFornitoreSelezionato));
                this._prodottiTableSupport.initialBuildAndSort = filtro;
        },


            // registerTableSelectEditEvents:true,
            // _detailSupport: this._detailSupport,
        });
        const filtro = new FiltersAndSorts();
        filtro.addFilter(new FilterDefinition('fornitore.id', FILTER_TYPES.not_string.equals, this.idFornitoreSelezionato));

        this._prodottiTableSupport = new ServicePrimeNgTableSupport({
            service: this.prodottoService,
            table: this.dtProdotti,
            registerTableSelectEditEvents: false,
            initialBuildAndSort: filtro,
        });
    }

    loadedData(): void {
        console.log(this.dtFornitori.value);
        this.dtFornitori.selection = this.dtFornitori.value[0];
        this.setDetail({data: this.dtFornitori.value[0]});
    }

    setDetail(event) {

        this.idFornitoreSelezionato = event.data.id;
        const filtro = new FiltersAndSorts();
        filtro.addFilter(new FilterDefinition('fornitore.id', FILTER_TYPES.not_string.equals, this.idFornitoreSelezionato));
        this._prodottiTableSupport.initialBuildAndSort = filtro;
        // for (let i=0; i<this._colsDetail.length;i++){
        //   const myfield=this._colsDetail[i].field;
        //   this.filterProdottiObj[''+myfield]='';
        // }
        for (const prop in this.filterProdottiObj) {
            if (this.filterProdottiObj.hasOwnProperty(prop)) {
                this.filterProdottiObj[prop] = '';
            }
        }
    }
    deleteFornitore(fornitore) {
        console.log(fornitore);
        const message = 'Eliminando il Fornitore: "' + fornitore.descrizione + '"' +
            ' verrano eliminati anche eventuali Prodotti associati.Come desideri procedere ?';
        this.askBeforeDelete(this._fornitoriTableSupport , fornitore ,'' , message);
    }

}
