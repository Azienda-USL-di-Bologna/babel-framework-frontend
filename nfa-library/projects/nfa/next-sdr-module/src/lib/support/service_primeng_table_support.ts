import {NextSDREntityProvider} from '../providers/next-sdr-entity-provider';
import {
    AdditionalDataDefinition,
    FilterDefinition,
    FiltersAndSorts, PagingConf,
    SORT_MODES,
    SortDefinition
} from '../definitions/filter-sort-definitions';
import {FilterMetadata, LazyLoadEvent} from 'primeng/api';
import {Mode, RestPagedResult} from '../definitions/definitions';
import {DatePipe} from '@angular/common';
import {Observable, isObservable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {EntityValidations, ValidationErrorsNextSDR} from '../validations/validations';
import {NextSdrEditPrimengComponent} from '../component/next-sdr-edit-primeng-component/next-sdr-edit-primeng-component';

import {cloneDeep} from 'lodash';


/**
 * Classe ponte fra una tabella di tipo p-table, un servizio di tipo {@link NextSDREntityProvider}
 * ed un eventuale dialog di modifica di tipo {@link NextSdrEditPrimengDialogComponent}
 *
 * La classe si occupa di fare le operazioni di base, come il binding della tabella col servizio,
 * l'applicazione della claudsole di filtro
 */
export class ServicePrimeNgTableSupport {

    protected _service: NextSDREntityProvider;
    protected _table: any;
    protected _editComponent: NextSdrEditPrimengComponent | any;
    protected _entityValidations: EntityValidations;
    protected _datePipe: DatePipe;
    protected _initialBuildAndSort: FiltersAndSorts;
    protected _projection: string;
    protected _limitOffsetMode: boolean;
    protected _searchFieldTrasformations: SearchFieldTrasformations = {};
    protected _reqErrorCallback: (error: any, mode: Mode, entity?: any) => void;
    protected _afterLoadCallback: (results: any) => void;
    protected _lastLazyLoadEvent: LazyLoadEvent;


    protected _tableLazyLoading: boolean;
    /**
     * Una funzione di callback che viene chiamata prima del salvataggio
     */
    public onBeforeSave: ({
                              /**
                               * entità che verrà salvata
                               */
                              entity,
                              additionalData: [],
                              /**
                               * se settato a {@literl true} interromperà il salvataggio
                               */
                              cancel: boolean,
                              /**
                               * Se è stata usata l'edit dialog questo parametro conterrà la modalità con cui è stat chiamata,
                               * altrimenti sarà undefined
                               */
                              mode: Mode,
                              /**
                               * Se è stata usata l'edit dialog questo parametro conterrà l'entità com'era in origine, altrimenti sarà undefined
                               */
                              preEditEntity
                          }) => void;
    /**
     * Una funzione di callback che viene chiamata prima della delete
     */
    public onBeforeDelete: ({entity: any, additionalData: [], cancel: boolean}) => void;
    /**
     * Una funziona di callback che viene chiamata dopo il salvataggio, ma prima che l'elemento sia messo in tabella
     */
    public onAfterSave: ({entity: any, mode: Mode}) => void;

    /**
     * Una funziona di callback che viene chiamata dopo l'eliminazione,
     */
    public onAfterDelete: ({entity: any}) => void;

    /**
     * Contiene l'entità in edit, da ripristinare in caso di annullamento dell'aggiornamento
     */
    protected _preEditEntity: any;

    constructor(config: ServicePrimeNgTableSupportConfig | any) {
        this._service = config.service;
        this._table = config.table;
        this._tableLazyLoading = config.tableLazyLoading === undefined || config.tableLazyLoading === null ? true : config.tableLazyLoading;
        this._editComponent = config.editComponent;
        this._entityValidations = config.entityValidations;
        this._datePipe = new DatePipe('it-IT');
        this._initialBuildAndSort = config.initialBuildAndSort ? config.initialBuildAndSort : this.buildInitialFiltersAndSortsDefault();
        this._projection = config.projection;
        this._limitOffsetMode = (config.limitOffsetMode === undefined || config.limitOffsetMode === null) ? false : config.limitOffsetMode;
        this._reqErrorCallback = config.onError ? config.onError : (error: any, mode: Mode) => null;
        this.onBeforeSave = config.onBeforeSave;
        this.onBeforeDelete = config.onBeforeDelete;
        this.onAfterSave = config.onAfterSave;
        this.onAfterDelete = config.onAfterDelete;
        this._afterLoadCallback = config.afterLoad;

        // SearchFieldTrasformations
        this._searchFieldTrasformations.datePattern = config.searchFieldTrasformations && config.searchFieldTrasformations.datePattern ?
            config.searchFieldTrasformations.datePattern : 'yyyy-MM-ddT00:00:00';
        this._searchFieldTrasformations.dateTimePattern = config.searchFieldTrasformations && config.searchFieldTrasformations.dateTimePattern ?
            config.searchFieldTrasformations.datePattern : 'yyyy-MM-ddTHH:mm:ss';

        this.manageRegisterEvents(config);

    }


    set initialBuildAndSort(value: FiltersAndSorts) {
        this._initialBuildAndSort = value;
        this.loadData(null);
    }

    set editComponent(value: NextSdrEditPrimengComponent | any) {
        this._editComponent = value;
    }

    get editComponent() {
        return this._editComponent;
    }

    /**
     * Metodo interno per la registrazione agli eventi
     * @param config
     */
    protected manageRegisterEvents(config: ServicePrimeNgTableSupportConfig) {
        if (config.registerTableLoadEvents === undefined || config.registerTableLoadEvents) {
            this.registerTableLoad();
        }
        if (config.registerTableSelectEditEvents === undefined || config.registerTableSelectEditEvents) {
            this.registerTableSelectEdit();
        }
        if (config.registerEditComponentEvents === undefined || config.registerEditComponentEvents) {
            this.registerEditEvent();
        }
    }

    public registerTableLoad() {
        this._table.onLazyLoad.subscribe(
            event => {
                //  console.info('on lazy load' + JSON.stringify(event));
                this.loadData(event);
            }
        );
        if (!this._tableLazyLoading) {
            this._table.onSort.subscribe(event => {

            });
            this._table.onFilter.subscribe(event => {

            });
            // se la tabella non è lazy carico tutti i record
            this.loadData(null);
        }
    }

    /**
     * Per registrasi agli eventi della tabella
     */
    public registerTableSelectEdit() {
        this._table.onRowSelect.subscribe(event => {
            this.startEdit('UPDATE', event.data);
        });
    }

    /**
     * Per registrasi agli eventi della @{link NextSdrEditPrimengComponent} di modifica,
     * passa anche eventuali regole di validazione alla dialog
     */
    public registerEditEvent() {
        if (this._editComponent) {
            this._editComponent.onCancel.subscribe(event => {
                this._editComponent.finishEdit();
            });
            this._editComponent.onSave.subscribe(event => {
                this.saveAndSubscribe(event.entity, event.mode);
            });
            this._editComponent.entityValidations = this._entityValidations;
        }
    }

    /**
     * Metodo per l'apertura del componente di edit, se questo è stata passata al costruttore
     * @param mode la modalità di edit
     * @param entity l'entità da editare
     */
    public startEdit(mode: Mode, entity: any) {
        if (this._editComponent) {
            this._preEditEntity = entity;
            // this._editComponent.entity = Object.assign({}, entity);
            this._editComponent.entity = cloneDeep(entity);
            this._editComponent.mode = mode;
            this._editComponent.startEdit();
        }
    }

    // ============================== SAVE STUFF ==================================================

    public deleteAndSubscribe(entity: any) {
        this.delete(entity).subscribe(value => {

        });
    }

    /**
     * Metodo per la cancellazione di un'entità, richiama il metodo del service per la cancellazione
     * poi chiama {@link ServicePrimeNgTableSupport#afterDeleteUpdate} per aggiornare la tabella
     * @param entity l'entità da cancellare
     * @return un observable che quando sottoscritto avvia la richiesta di cancellazione
     *          o null se l'operazione viene cancellata ovvero cancel a {@literal true} su {@link this#onBeforeSave}
     */
    public delete(entity: any): Observable<any> {
        const entityKey = this._service.getKeyOfEntity(entity);
        const additionalData: AdditionalDataDefinition[] = [];
        if (this.onBeforeDelete) {
            const forCallBack = {entity: entity, additionalData: additionalData, cancel: false};
            this.onBeforeDelete(forCallBack);
            if (forCallBack.cancel) {
                return null;
            }
        }
        return this._service.deleteHttpCall(entityKey, additionalData)
            .pipe(
                tap(value => {
                    this.afterDeleteUpdate(entity);
                }),
                catchError(err => of(
                    this._reqErrorCallback(err, 'DELETE', entity)
                )),
            );
    }

    /**
     * Le operazioni che vengono eseguite dopo una delete, in particolare si rimuove l'entità dalla tabella.
     * Il metodo è da usare se non si ricorre alla delete standard ma si vogliono aggiornar ei dati della tabella
     * @param entity
     */
    public afterDeleteUpdate(entity: any) {
        if (this.onAfterDelete) {
            this.onAfterDelete({entity: entity});
        }
        const index = this._table._value
            .findIndex(entityTable => this._service.getKeyOfEntity(entityTable) === this._service.getKeyOfEntity(entity));
        this._table._value.splice(index, 1);
    }


    /**
     * Il metodo si occupa del salvataggio di un'entità
     * chiama le validazioni e lavora di comune accordo con la dialog di modifica se presente
     * registra sull'observable la chiamata della callback dell'AfterSave
     * @param entity l'entità da salvare
     * @param mode la modalità di salvataggio
     * @return l'observable da lanciare al salvataggio, se ci sono errori bloccanti la lista degli errori di validazione,
     *          o null se l'operazione viene cancellata ovvero cancel a {@literal true} su {@link this#onBeforeSave}
     */
    public save(entity: any, mode: Mode): Observable<any> | ValidationErrorsNextSDR[] | null {
        // mi faccio dare eventuali errori di validazione
        const errors: ValidationErrorsNextSDR[] = this.checkValidations(entity);
        // faccio stampare alla dialog eventuali errori di validazione
        if (this._editComponent && errors.length > 0) {
            this._editComponent.showValidationMessageError(errors);
        }
        // controllo se ci sono errori bloccanti e se devo fare chiudere automaticamente la dialog
        const isBlocking = errors.map(value => value.isBlocking)
            .reduce((previousValue, currentValue) => previousValue || currentValue, false);
        const hideDialog = errors.length === 0;

        // se non ci sono errori bloccanti creo l'observable di savataggio
        if (!isBlocking) {
            // gestisco la callback onBeforeSave se esiste
            const additionalData: AdditionalDataDefinition[] = [];
            if (this.onBeforeSave) {
                const forCallBack = {
                    entity: entity, additionalData: additionalData, cancel: false,
                    mode: mode ? mode : undefined,
                    preEditEntity: this._preEditEntity ? cloneDeep(this._preEditEntity) : undefined
                };
                this.onBeforeSave(forCallBack);
                if (forCallBack.cancel) {
                    return null;
                }
            }

            if (mode === 'UPDATE') {
                const entityKey = this._service.getKeyOfEntity(entity);
                return this._service.patchHttpCall(entity, entityKey, this._projection, additionalData)
                    .pipe(
                        tap(value => {
                            this.afterSaveUpdate(value, mode, hideDialog);
                        }),
                        catchError(err => of(
                            this._reqErrorCallback(err, 'UPDATE', entity)
                        )),
                    );
            }
            if (mode === 'INSERT') {
                return this._service.postHttpCall(entity, this._projection, additionalData)
                    .pipe(
                        tap(value => {
                            this.afterSaveUpdate(value, mode, hideDialog);
                        }),
                        catchError(err => of(
                            this._reqErrorCallback(err, 'INSERT', entity)
                        )),
                    );
            }
        } else {
            // altrimenti torno gli errori di validazione
            return errors;
        }
    }

    /**
     * Metodo di comodo, nel caso in cui il {@link ServicePrimeNgTableSupport#save} ritorni un observable lo sottoscrive
     * @param entity
     * @param mode
     */
    public saveAndSubscribe(entity: any, mode: Mode) {
        const saveResult: any = this.save(entity, mode);
        // Sostituito il codice per verificare che un oggetto sia un observable utilizzando
        // l'operatore isObservable di rxjs perché constructor.name non funziona compilato con --prod
        // in quanto vengono cambiati i nomi delle classi e di conseguenza dei costruttori
        // if (saveResult && saveResult.constructor.name === 'Observable') {
        if (saveResult && isObservable(saveResult)) {
            saveResult.subscribe(value => {

            });
        }
    }

    /**
     * Se il salvataggio è andato a buon fine si occupa di lancaire l'evento onAfterSave,
     * aggiuge o sostituisce l'elemento salvato sulla tabella,
     * a seconda del parametro e della presenza di una _editComponent si occupa di chiuderla
     * @param entity l'entità appena salvata\creata
     * @param mode
     * @param hideDialog un booleano per dire se chiudere o meno la dialog
     */
    public afterSaveUpdate(entity: any, mode: Mode, hideDialog: boolean) {
        if (this.onAfterSave) {
            this.onAfterSave({entity: entity, mode: mode});
        }
        if (mode === 'UPDATE') {
            const index = this._table._value
                .findIndex(entityTable => this._service.getKeyOfEntity(entityTable) === this._service.getKeyOfEntity(entity));
            this._table._value[index] = entity;
        }
        if (mode === 'INSERT') {
            this._table._value.unshift(entity);
        }
        // gestione della dialog
        if (this._editComponent) {
            if (hideDialog) {
                // o chiudo la dialog
                this._editComponent.finishEdit();
            } else {
                // o aggiorno i dati della dialog con quelli del salvataggio
                this.startEdit('UPDATE', entity);
            }
        }
    }

    /**
     * Si occupa di chiamare le validazioni su un'entità
     * @param entity l'entità su cui chiamare i validatori
     * @return gli errori di validazioni oppure un array vuoto
     */
    public checkValidations(entity: any): ValidationErrorsNextSDR[] {
        if (this._entityValidations) {
            const errors: ValidationErrorsNextSDR[] = this._entityValidations.validate(entity);
            return errors;
        }
        return [];
    }


    // ====================== LOAD STUFF ============================================================

    /**
     * Metodo per la gestione di eventi {@link LazyLoadEvent} della tabella
     * Si occupa di creare i filtri, richiamare il servizio corretto per il quering dell'entità e di valorizzare la tabella
     * @param event
     */
    protected loadData(event: LazyLoadEvent) {
        this._lastLazyLoadEvent = event;
        this._table.loading = true;
        this._service.getData(this._projection, this._initialBuildAndSort,
            this.buildLazyEventFiltersAndSorts(event, this._table.columns, this._datePipe), this.buildPagingConf(event))
            .subscribe(
                (data: RestPagedResult) => {
                    // this._table._value = undefined;
                    // this._table._totalRecords = 0;
                    if (data && data.results && data.page) {
                        this._table.value = <any[]>data.results;
                        this._table.totalRecords = data.page.totalElements;
                        if (this._afterLoadCallback) {
                            this._afterLoadCallback(data.results);
                        }
                    }
                    this._table.loading = false;
                },
                ((error: any) => {
                    if (this._reqErrorCallback) {
                        this._reqErrorCallback(error, 'GET');
                    }
                    this._table.loading = false;
                })
            );
    }

    /**
     * Metodo per la il refresh della tabella
     * Recupera l'ultimo LazyLoadEvent passato e lancia loadData con l'ultimo LazyLoadEvent
     */
    public refreshData() {
        if (this._lastLazyLoadEvent !== null) {
            this.loadData(this._lastLazyLoadEvent);
        }
    }

    /**
     * Metodo per la il refresh della tabella
     * Recupera l'ultimo LazyLoadEvent passato lo pulisce dei filtri e lancia loadData con l'ultimo LazyLoadEvent
     */
    public refreshAndResetFilters() {
        this._table.filters = {};
        if (this._lastLazyLoadEvent !== null) {
            this._lastLazyLoadEvent.filters = {};
            this.loadData(this._lastLazyLoadEvent);
        }
    }

    // ============================== SEARCH STUFF ============================================================

    /**
     * Crea un'istanza vuota di filtri e ordinamento
     */
    protected buildInitialFiltersAndSortsDefault(): FiltersAndSorts {
        const initialFiltersAndSorts = new FiltersAndSorts();
        return initialFiltersAndSorts;
    }

    /**
     * Metodo per la creazione di filtri compatibili con NextSdr
     * @param event l'evento di lazy loading della tabella
     * @param columns
     * @param datepipe
     */
    protected buildLazyEventFiltersAndSorts(event: LazyLoadEvent, columns: any[], datepipe: DatePipe): FiltersAndSorts {
        const lazyEventFiltersAndSorts = new FiltersAndSorts();
        if (event) {
            if (event.filters) {
                const keys: string[] = Object.keys(event.filters);
                for (const key of keys) {
                    // la variabile indica se nessuna trasformazione è stata usata e quindi il filtro deve essere applicato direttamente
                    let noTrasformationUsed = true;
                    const filterColumn = columns
                        .find(currCol => currCol.field === key);
                    const filterMetadata: FilterMetadata = event.filters[key];
                    if (filterColumn) {
                        // trasformazioni per i filtri di tipo data
                        if (filterColumn.fieldType === 'Date' || filterColumn.fieldType === 'DateTime') {
                            const pattern = filterColumn.fieldType === 'Date' ? this._searchFieldTrasformations.datePattern :
                                this._searchFieldTrasformations.dateTimePattern;
                            filterMetadata.value.forEach(element => {
                                /* TODO: nella definizione dell'entità sul back-end.*/
                                if (element) {
                                    lazyEventFiltersAndSorts.addFilter(
                                        new FilterDefinition(key, filterColumn.filterMatchMode, datepipe.transform(element, pattern)));
                                }
                            });
                            noTrasformationUsed = false;
                        }
                    }
                    if (noTrasformationUsed) {
                        lazyEventFiltersAndSorts
                            .addFilter(new FilterDefinition(key, filterMetadata.matchMode, event.filters[key].value));
                    }
                }
            }
            if (event.sortField) {
                const sortColumn = columns.find(currCol => currCol.field === event.sortField);
                // se è un campo calcolato potrebbe essere composto da più subfields e tutti questi concorrono nell'ordinamento
                // queste informazioni le prendo dalle columns che vengono passate dal componente dell'applicazione
                if (sortColumn.campoCalcolato === true) {
                    sortColumn.subfields.array.forEach(element => {
                        lazyEventFiltersAndSorts.addSort(new SortDefinition(element, event.sortOrder === 1 ?
                            SORT_MODES.asc : SORT_MODES.desc));
                    });
                } else {
                    // per ora gestiamo solo il caso di un solo filtro (widget importati con ordinamento singolo)
                    lazyEventFiltersAndSorts.addSort(new SortDefinition(event.sortField, event.sortOrder === 1 ?
                        SORT_MODES.asc : SORT_MODES.desc));
                }
            }
       //     lazyEventFiltersAndSorts.first = event.first;
        //    lazyEventFiltersAndSorts.rows = event.rows;
        }

        return lazyEventFiltersAndSorts;
    }

    protected buildPagingConf(event: LazyLoadEvent | any): PagingConf {
        if (event) {
            if (this._limitOffsetMode) {
                return {mode: 'LIMIT_OFFSET', conf: {limit: event.rows, offset: event.first}};
            } else {
                return {mode: 'PAGE', conf: {page: event.first / event.rows, size: event.rows}};
            }
        } else {
            return {mode: 'NONE'};
        }
    }
}


/**
 * Classe di configurazione per {@link ServicePrimeNgTableSupport}
 */
export interface ServicePrimeNgTableSupportConfig {
    /**
     * Il service per accedere alle entità
     */
    service: NextSDREntityProvider;
    /**
     * L'istanza della tabella p-table
     */
    table: any;
    /**
     * Per indicare se la tabella è lazy, se lazy tutti gli oggetti verranno caricati con una sola chiamata all'inizio,
     * questo flag deve essere sincronizzato col parametry lazy della table
     * DEFAULT true
     */
    tableLazyLoading: boolean;
    /**
     * L'istanza della _editComponent
     */
    editComponent?: NextSdrEditPrimengComponent | any;
    /**
     * La classe per la gestione delle validazioni sull'entità trattata dal service
     */
    entityValidations?: EntityValidations;
    /**
     * Se deve automaticamente registrasi agli eventi lazy load della tabella
     * DEAFULT true
     */
    registerTableLoadEvents?: boolean;

    /**
     * Se deve automaticamente registrasi all'evento onRowSelected della tabella
     * DEAFULT true
     */
    registerTableSelectEditEvents?: boolean;

    /**
     * Se deve automaticamente registrasi agli eventi della {@link NextSdrEditPrimengComponent}
     * DEAFULT true
     */
    registerEditComponentEvents?: boolean;

    /**
     * valore inziale per i filtri e l'ordinamento degli elementi della tabella
     */
    initialBuildAndSort?: FiltersAndSorts;

    /**
     * Projection che verrà usata nella richiesta
     */
    projection?: string;

    /**
     * Indica se deve funzionare in modalità limit/offset e non in modalità paginata, vedi {@link NextSDREntityProvider#buildQueryParams},
     * DEAFULT {@literal false}
     */
    limitOffsetMode?: boolean;

    searchFieldTrasformations?: SearchFieldTrasformations | any;
    /**
     * Callback chiamata prima del salvataggio
     */
    onBeforeSave?: ({entity: any, additionalData: [], cancel: boolean}) => void;

    /**
     * Callback chiamata prima di una delete
     */
    onBeforeDelete?: ({entity: any, additionalData: [], cancel: boolean}) => void;

    /**
     * Callback chiamata dopo un salvataggio
     */
    onAfterSave?: ({entity: any}) => void;

    /**
     * Callback chiamata dopo  una delete
     */
    onAfterDelete?: ({entity: any}) => void;

    /**
     * Callback chiamata in caso di errore nelle richieste (sia quelle GET effettuate per recuperare i dati della tabella che quelle di
     * aggiornamento/inserimento effettuate dal componente di detail)
     */
    onError?: (error: any, mode: Mode) => void;
    /**
     * Callback chiamata in caso di errore nelle richieste dopo che i dati sono stati caricati correttamente
     * (utilile se una volta caricatii dati si voglia evidenziare la prima riga e settare un detail con la prima riga)
     */
    afterLoad?: (result: any) => void;
}

export interface SearchFieldTrasformations {
    /**
     * Il pattern da usare per trasformare la Date in ricerca
     * DEFAULT yyyy-MM-ddT00:00:00
     */
    datePattern?: string;
    /**
     * Il pattern da usare per trasformare la DateTime in ricerca
     * DEFAULT yyyy-MM-ddTHH:mm:ss
     */
    dateTimePattern?: string;
}
