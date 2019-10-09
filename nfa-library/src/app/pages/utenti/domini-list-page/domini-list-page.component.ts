import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {BaseProjectComponent} from '../../../shared-component-module/base-component/base-project-component';
import {DominioService} from '../../../services/utenti/dominio-service';
import {EntityValidations, FILTER_TYPES, Mode, PTableColumn, ServicePrimeNgTableSupport} from '@nfa/next-sdr';
import {DominioValidations} from '../../../entities/validations/DominioValidations';
import {MenuItem} from 'primeng/api';
import {TipoEventoService} from '../../../services/eventi/tipo-evento-service';
import {BroadcastProvider} from '@nfa/core';
import {FornitoreService} from '../../../services/prodotti/fornitore-service';
import {Table} from 'primeng/table';
import {NotificationMessageSeverity} from '@nfa/ref';


@Component(
    {
        selector: 'app-domini-list-page.component',
        templateUrl: './domini-list-page.component.html',
        //styleUrls: ['./domini-list-page-component.css']
    }
)

export class DominiListPageComponent extends BaseProjectComponent implements OnInit {


// Array che raccolgono le definizioni per le colonne delle tabella
    public _cols: PTableColumn[];
    public _colsTipi: PTableColumn[];
    public _colsFornitori: PTableColumn[];

    public allTipi: Array<any>;
    public addedTipi: Array<any>;

    public allFornitori: Array<any>;
    public addedFornitori: Array<any>;
    // oggetto di supporto per la tabella
    _dominiTableSupport: ServicePrimeNgTableSupport;
    public selectedDominio: any;
    public originalDominio: any;
    // booleano che mi dice se è visibile il campo di ricerca
    public dominiSearching: boolean;

    @ViewChild('dtDomini') dtDomini: any;
    @ViewChild('editDialog') editDialog: any;
    @ViewChild('dtFornitoriAll') dtFornitoriAll:Table;
    @ViewChild('dtFornitoriAdded') dtFornitoriAdded:Table;
    @ViewChild('dtTipiAdded') dtTipiAdded:Table;
    @ViewChild('dtTipiAll') dtTipiAll:Table;

    editing: boolean;
    // elenco di comandi da mostrare in toolbar
    dominiToolbarItems: MenuItem[] =
        [
            {
                icon: 'fa fa-plus',
                command: (event) => {
                    this.openInsert();
                }
            },
            {
                icon: 'fa fa-search',
                command: (event) => {
                    this.dominiToogleSearchMode();
                }
            },
            {
                icon: 'fa fa-refresh',
                command: (event) => {
                    this._dominiTableSupport.refreshData();
                }
            },
            {
                icon: 'fa fa-file-excel-o',
                command:(event)=>{

                    this.dtDomini.exportCSV();
                }
            },
        ];

    dominiToolbarTitle = 'Domini';


    constructor(public _router: Router,
                protected dominioService: DominioService,
                protected tipoService: TipoEventoService,
                protected fornitoreService: FornitoreService,
                protected broadCaster: BroadcastProvider,
    ) {
        super({router: _router});
        this._broadcastProvider = this.broadCaster;
    }

    ngOnInit() {
        this._cols = [
            {
                field: 'descrizione',
                header: 'Dominio',
                filterMatchMode: FILTER_TYPES.string.containsIgnoreCase,
                fieldType: 'string'
            },

        ];

        this._colsTipi = [
            {
                field: 'tipoEvento.descrizione',
                header: 'Tipo',
                filterMatchMode: FILTER_TYPES.string.containsIgnoreCase,
                fieldType: 'object'
            },

        ];

        this._colsFornitori = [
            {
                field: 'fornitore.descrizione',
                header: 'Fornitore',
                filterMatchMode: FILTER_TYPES.string.containsIgnoreCase,
                fieldType: 'object'
            },

        ];


        this._dominiTableSupport = new ServicePrimeNgTableSupport({
            service: this.dominioService,
            table: this.dtDomini,
            editComponent: this.editDialog,
            registerTableSelectEditEvents: false,
            entityValidations: new EntityValidations([], DominioValidations.validate),
            projection: 'dominioProjectionExtendedFornitoriAbilitatiExtendedTipiEventoAbilitati',
            onError: (error: any, mode: Mode) => {
                this.showRequestErrorMessage(error);

            },

        });
    }

    // funzione per mostrare/nascondere i campi di ricerca
    dominiToogleSearchMode() {
        this.dominiSearching = !this.dominiSearching;
        this._dominiTableSupport.refreshAndResetFilters();
    }

    openInsert() {
        //const myNewDominio = {

        //};
        this.selectedDominio = {
            tipiEventoAbilitati: [],
            fornitoriAbilitati:[],
        }
        //this.addedTipi = myNewDominio.tipiEventoAbilitati;
        //this.addedFornitori = myNewDominio.fornitoriAbilitati;
        this.tipoService.getAllTipi().subscribe(
            result => {
                const myTipi = result._embedded.tipi_evento;
                const tipiAbilitati = myTipi.map(tipo => new Object({tipoEvento:tipo}));
                this.allTipi = tipiAbilitati;

                this.fornitoreService.getAllFornitori().subscribe(
                    result2 => {
                        const myFornitori=result2._embedded.fornitori;
                        const fornitoriAbilitati= myFornitori.map(f => new Object({fornitore:f}));
                        this.allFornitori=fornitoriAbilitati;
                        this._dominiTableSupport.startEdit('INSERT', this.selectedDominio);
                    },
                    error2=>{

                    }
                );
            },
            error => {

            }
        );
    }

    openDetail(dominio: any) {
      // this.originalDominio = {};
      //   this.selectedDominio = {};
      //   Object.assign(this.originalDominio, dominio);
      //   Object.assign(this.selectedDominio, dominio);
        // azzero Array delle relazioni
        this.addedTipi = [];
        this.allFornitori = [];
        this.addedFornitori = [];
        // gestisco i tipi evento
        this.tipoService.getAllTipi().subscribe(
            result => {
                const myTipi= result._embedded.tipi_evento;
                const tipiAbilitati = myTipi.map(tipo => new Object({tipoEvento:tipo}));
                this.allTipi = tipiAbilitati;
                for (const tipo of dominio.tipiEventoAbilitati) {
                    const index = this.allTipi.findIndex((i => i.tipoEvento.id === tipo.tipoEvento.id));
                    if (index >= 0) {
                        this.allTipi.splice(index, 1);
                    }
                }
                // se va a buon fine recupero anche i fornitori e li gestisco
                this.fornitoreService.getAllFornitori().subscribe(
                    result2=>{
                        const myFornitori=result2._embedded.fornitori;
                        const fornitoriAbilitati= myFornitori.map(f => new Object({fornitore:f}));
                        this.allFornitori=fornitoriAbilitati;
                        for (const fornitore of dominio.fornitoriAbilitati) {
                            const index2 = this.allFornitori.findIndex((i => i.fornitore.id === fornitore.fornitore.id));
                            if (index2 >= 0) {
                                this.allFornitori.splice(index2, 1);
                            }
                        }
                        this._dominiTableSupport.startEdit('UPDATE', dominio);
                    },
                    error=>{
                        // errore Fornitori

                    }
                );

            },
            error => {
                // errore tipiEvento


            }
        );

    }

    addTipo(tipo: any,dominio:any) {
        const index = this.allTipi.findIndex((i => i.tipoEvento.id === tipo.tipoEvento.id));
        this.allTipi.splice(index, 1);
        dominio.tipiEventoAbilitati.push(tipo);
        this.dtTipiAdded.reset();
        this.dtTipiAll.reset();
    }

    resetTipo(tipo: any,dominio:any) {
        const index = dominio.tipiEventoAbilitati.findIndex((i => i.tipoEvento.id === tipo.tipoEvento.id));
        dominio.tipiEventoAbilitati.splice(index, 1);
        this.allTipi.push(tipo);
        this.dtTipiAdded.reset();
        this.dtTipiAll.reset();
    }

    addFornitore(fornitore: any,dominio:any) {
        const index = this.allFornitori.findIndex((i => i.fornitore.id === fornitore.fornitore.id));
        this.allFornitori.splice(index, 1);
        dominio.fornitoriAbilitati.push(fornitore);
        this.dtFornitoriAll.reset();
        this.dtFornitoriAdded.reset();
    }

    resetFornitore(fornitore: any,dominio:any) {
        const index =dominio.fornitoriAbilitati.findIndex((i => i.fornitore.id === fornitore.fornitore.id));
        dominio.fornitoriAbilitati.splice(index, 1);
        this.allFornitori.push(fornitore);
        this.dtFornitoriAll.reset();
        this.dtFornitoriAdded.reset();
    }

    finish(event){
        console.log(event);
        // console.log(this.selectedDominio);
        // console.log(this.originalDominio);
        this.editing=false;
    }
}

