import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {DatePipe} from '@angular/common';
import {NextSdrEntityConfiguration, NextSdrEntity, BatchOperation, RestPagedResult} from '../definitions/definitions';
import {UtilityFunctions} from '../utils/utility-functions';
import {
    FilterDefinition,
    SortDefinition,
    FiltersAndSorts,
    AdditionalDataDefinition,
    PagingConf
} from '../definitions/filter-sort-definitions';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';


/**
 * La classe astratta che deve essere implementata da tutti i services che vogliono utilizare NextSDR
 */
export abstract class NextSDREntityProvider {

    protected _RESPONSE_PAGE_FIELDS = 'page';
    protected _RESPONSE_RESULTS_FIELDS = '_embedded';

    protected _PAGING_OFFSET_PARAMETER = 'pagingOffset';
    protected _PAGING_LIMIT_PARAMETER = 'pagingLimit';

    protected _PAGING_PAGE_PARAMETER = 'page';
    protected _PAGING_SIZE_PARAMETER = 'size';


    protected http: HttpClient;
    protected datepipe: DatePipe;
    protected entityConfiguration: NextSdrEntityConfiguration;
    protected restApiBaseUrl: string;

    constructor(http: HttpClient, datepipe: DatePipe, entityConfiguration: NextSdrEntityConfiguration, restApiBaseUrl: string) {
        this.http = http;
        this.datepipe = datepipe;
        this.entityConfiguration = entityConfiguration;

        // Se c'è la barra finale nell'url la togliamo
        if (restApiBaseUrl.endsWith('/')) {
            this.restApiBaseUrl = restApiBaseUrl.substr(0, restApiBaseUrl.length - 1);
        } else {
            this.restApiBaseUrl = restApiBaseUrl;
        }
    }

    /**
     * Metodo semicablato per querare e ottenere le entità
     * @param projection la projection che si vuole utilizzare per i risultati
     * @param initialFiltersAndSorts
     * @param lazyEventFiltersAndSorts
     * @param pagingConf vedi pagingConf di {@link this#getHttpCall}
     */
    getData(projection?: string, initialFiltersAndSorts?: FiltersAndSorts, lazyEventFiltersAndSorts?: FiltersAndSorts,
            pagingConf?: PagingConf,): Observable<any> {
        //  const queryString = this.buildQueryString(projection, initialFiltersAndSorts, lazyEventFiltersAndSorts);
        return this.getHttpCall(projection, initialFiltersAndSorts, lazyEventFiltersAndSorts, pagingConf)
            .pipe(
                map(data => {
                    //  console.log('DATA', data);
                    if (data[this._RESPONSE_RESULTS_FIELDS]) {
                        for (let prop in data._embedded) {
                            UtilityFunctions.callFunctionForArray(UtilityFunctions.fixDateFields, data._embedded[prop]);
                        }
                    }
                    return data;
                }),
                map(value => {
                    const result: RestPagedResult = {
                        page: value[this._RESPONSE_PAGE_FIELDS],
                        results: [],
                    };
                    // se ci sono risultati nella response li setto
                    if (value[this._RESPONSE_RESULTS_FIELDS] &&
                        value[this._RESPONSE_RESULTS_FIELDS][this.entityConfiguration.collectionResourceRel]) {
                        result.results = value[this._RESPONSE_RESULTS_FIELDS][this.entityConfiguration.collectionResourceRel];
                    }
                    return result;
                })
                //   catchError(err => {
                //   console.log('ERROR', err);
                // }
            );
    }

    /**
     * Refactor del metodo di sopra, restitutisce degli httpParams invece che una stringa
     * @param httpParams
     * @param projection
     * @param initialFiltersAndSorts
     * @param lazyEventFiltersAndSorts
     * @param additionalData
     * @param pagingConf
     */
    protected buildQueryParams(httpParams: HttpParams, projection?: string, initialFiltersAndSorts?: FiltersAndSorts,
                               lazyEventFiltersAndSorts?: FiltersAndSorts, additionalData?: AdditionalDataDefinition[],
                               pagingConf?: PagingConf,): HttpParams {

        if (!httpParams) {
            httpParams = new HttpParams();
        }

        if (projection) {
            httpParams = httpParams.append('projection', projection);
        }

        const lazyLoadFilters: FilterDefinition[] =
            lazyEventFiltersAndSorts ? lazyEventFiltersAndSorts.filters : new Array<FilterDefinition>();
        const lazyLoadSorts: SortDefinition[] =
            lazyEventFiltersAndSorts ? lazyEventFiltersAndSorts.sorts : new Array<SortDefinition>();
        const lazyLoadAdditionalData: AdditionalDataDefinition[] =
            lazyEventFiltersAndSorts ? lazyEventFiltersAndSorts.additionalDatas : new Array<AdditionalDataDefinition>();
        const initialFilters: FilterDefinition[] =
            initialFiltersAndSorts ? initialFiltersAndSorts.filters : new Array<FilterDefinition>();
        const initialSorts: SortDefinition[] =
            initialFiltersAndSorts ? initialFiltersAndSorts.sorts : new Array<SortDefinition>();
        const initialAdditionalData: AdditionalDataDefinition[] =
            initialFiltersAndSorts ? initialFiltersAndSorts.additionalDatas : new Array<AdditionalDataDefinition>();
        const currentAdditionalData = additionalData ? additionalData : new Array<AdditionalDataDefinition>();

        let totalFilters: FilterDefinition[] = new Array<FilterDefinition>();
        let totalSorts: SortDefinition[] = new Array<SortDefinition>();
        let totalAdditionalDatas: AdditionalDataDefinition[] = new Array<AdditionalDataDefinition>();

        totalFilters = [...initialFilters, ...lazyLoadFilters];
        totalSorts = [...lazyLoadSorts, ...initialSorts];
        totalAdditionalDatas = [...lazyLoadAdditionalData, ...initialAdditionalData, ...currentAdditionalData];

        totalFilters.forEach(element => {
            // se il filterMatchMode è un filtro su un campo non_stringa e l'unico operatore accettato è l'uguale (=)
            if (element.filterMatchMode === '') {
                httpParams = httpParams.append(element.field, element.value);
            } else {
                httpParams = httpParams.append(element.field, '$' + element.filterMatchMode + '(' + element.value + ')');
            }
        });

        totalSorts.forEach(element => {
            httpParams = httpParams.append('sort', element.field + ',' + element.orderMode);
        });

        totalAdditionalDatas.forEach(element => {
            httpParams = httpParams.append('additionalData', element.name + '=' + element.value);
        });

        if (pagingConf){
            switch (pagingConf.mode) {
                case 'PAGE':
                    httpParams = httpParams.append(this._PAGING_PAGE_PARAMETER, pagingConf.conf.page);
                    httpParams = httpParams.append(this._PAGING_SIZE_PARAMETER, pagingConf.conf.size);
                    break;
                case 'LIMIT_OFFSET':
                    httpParams = httpParams.append(this._PAGING_OFFSET_PARAMETER, pagingConf.conf.offset);
                    httpParams = httpParams.append(this._PAGING_LIMIT_PARAMETER, pagingConf.conf.limit);
                    break;
                case 'NONE':
                    httpParams = httpParams.append(this._PAGING_PAGE_PARAMETER, '0');
                    httpParams = httpParams.append(this._PAGING_SIZE_PARAMETER, '9999999');
            }
        }

        // if (lazyEventFiltersAndSorts && lazyEventFiltersAndSorts.first !== null && lazyEventFiltersAndSorts.rows !== null) {
        //   if (limitOffsetMode === false) {
        //     // modalità paginazione classica
        //     httpParams = httpParams.append(this._PAGING_PAGE_PARAMETER,
        //       String(lazyEventFiltersAndSorts.first / lazyEventFiltersAndSorts.rows) );
        //     httpParams = httpParams.append(this._PAGING_SIZE_PARAMETER, String(lazyEventFiltersAndSorts.rows) );
        //   } else {
        //     // modalità paginazione con limit e offset
        //     httpParams = httpParams.append(this._PAGING_OFFSET_PARAMETER, String(lazyEventFiltersAndSorts.first) );
        //     httpParams = httpParams.append(this._PAGING_LIMIT_PARAMETER, String(lazyEventFiltersAndSorts.rows) );
        //   }
        //
        // }
        return httpParams;
    }


    /**
     * metodo di get per ottenere le entità
     * @param projection la projection che si vuole utilizzare per i risultati
     * @param initialFiltersAndSorts
     * @param lazyEventFiltersAndSorts
     * @param pagingConf per selezionare la modalità di paginazione
     */
    public getHttpCall(projection?: string, initialFiltersAndSorts?: FiltersAndSorts, lazyEventFiltersAndSorts?: FiltersAndSorts,
                       pagingConf?: PagingConf, additionalHeaders?: any )
        : Observable<any> {
        const url = this.restApiBaseUrl + '/' + this.entityConfiguration.path;
        const httpParams: HttpParams = this.buildQueryParams(null, projection, initialFiltersAndSorts,
            lazyEventFiltersAndSorts, null, pagingConf);

        const options = {
            params: httpParams
        };

        if (additionalHeaders) {
            let headers = new HttpHeaders({});
            for (const field of Object.keys(additionalHeaders)) {
                headers = headers.set(field, additionalHeaders[field]);
            }
            options['headers'] = headers;
        }

        return this.http.get<any>(url, options);
    }

    /**
     * Fa una chiamata PATCH utile per aggiornare un entità passando solo i campi che si vogliono aggiornare
     * @param elementToUpdate l'entità con i campi che si vogliono aggiornare popolati
     * @param id l'id dell'entità da aggiornare
     * @param projection la projection da applicare all'entità modificata
     * @param additionalData dati opzionali per gli interceptor
     */
    public patchHttpCall(elementToUpdate: NextSdrEntity, id: number, projection?: string, additionalData?: AdditionalDataDefinition[], additionalHeaders?: any)
        : Observable<any> {
        const elementToUpdateClean = UtilityFunctions.cleanObjForHttpCall(elementToUpdate, this.datepipe);
        this.removeKeyFromEntity(elementToUpdateClean);
        const url = this.restApiBaseUrl + '/' + this.entityConfiguration.path + '/' + id;
        const httpParams: HttpParams = this.buildQueryParams(null, projection, null, null, additionalData);

        const options = {
            //  headers: new HttpHeaders({'Content-Type': 'application/json'})
            headers: new HttpHeaders({'Content-Type': 'application/merge-patch+json'}),
            params: httpParams,
        };
        
        if (additionalHeaders) {
            for (const field of Object.keys(additionalHeaders)) {
                options.headers = options.headers.set(field, additionalHeaders[field]);
            }
        }

        return this.http.patch(url, elementToUpdateClean, options);
    }



    /**
     * Fa una chiamata POST per la creazione di una nuova entità
     * @param entityToInsert l'entità da creare
     * @param projection la projection da applicare all'entità inserita
     * @param additionalData dati opzionali per gli interceptor
     */
    public postHttpCall(entityToInsert: NextSdrEntity, projection?: string, additionalData?: AdditionalDataDefinition[], additionalHeaders?: any): Observable<any> {
        // this.removeKeyFromEntity(entityToInsert);
        const elementToInsertClean = UtilityFunctions.cleanObjForHttpCall(entityToInsert, this.datepipe);
        const url = this.restApiBaseUrl + '/' + this.entityConfiguration.path;
        const httpParams: HttpParams = this.buildQueryParams(null, projection, null, null, additionalData);

        const options = {
            headers: new HttpHeaders({'Content-Type': 'application/json'}),
            params: httpParams,
        };

        if (additionalHeaders) {
            for (const field of Object.keys(additionalHeaders)) {
                options.headers = options.headers.set(field, additionalHeaders[field]);
            }
        }

        return this.http.post(url, elementToInsertClean, options);
    }

    /**
     * Fa una chiamata delete, utili per cancellare un entità
     * @param id l'id dell'entita da cancellare
     * @param additionalData dati opzionali per gli interceptor
     */
    public deleteHttpCall(id: number, additionalData?: AdditionalDataDefinition[], additionalHeaders?: any): Observable<any> {
        const url = this.restApiBaseUrl + '/' + this.entityConfiguration.path + '/' + id;
        const httpParams: HttpParams = this.buildQueryParams(null, null, null, null, additionalData);

        // if (additionalData) {
        //     const queryString = this.buildQueryString(null, null, null, additionalData);
        //     if (queryString && queryString !== '') {
        //         url += '?' + queryString;
        //     }
        // }


        const options = {
            headers: new HttpHeaders({'Content-Type': 'application/json'}),
            params: httpParams,
        };
        
        if (additionalHeaders) {
            for (const field of Object.keys(additionalHeaders)) {
                options.headers = options.headers.set(field, additionalHeaders[field]);
            }
        }
        
        return this.http.delete(url, options);
    }

    public batchHttpCall(batchOperations: BatchOperation[], additionalHeaders?: any): Observable<any> {
        batchOperations.forEach(batchOperation => batchOperation.entityBody = UtilityFunctions.cleanObjForHttpCall(batchOperation.entityBody, this.datepipe));
        const url = this.restApiBaseUrl + "/batch";
        const options = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        }

        if (additionalHeaders) {
            for (const field of Object.keys(additionalHeaders)) {
                options.headers = options.headers.set(field, additionalHeaders[field]);
            }
        }
        
        return this.http.post(url, batchOperations, options);
    }

    /**
     * Rimuove la chiave dall'entita
     * @param entity
     */
    protected removeKeyFromEntity(entity: any) {
        if (entity[this.entityConfiguration.keyName]) {
            delete entity[this.entityConfiguration.keyName];
        }
    }

    /**
     * Torna la chiave di un'entità
     * @param entity
     */
    public getKeyOfEntity(entity: any) {
        return entity[this.entityConfiguration.keyName];
    }

}

