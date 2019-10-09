
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DatePipe } from "@angular/common";
import { EntityConfiguration, Entity, BatchOperation } from "../definitions";
import { UtilityFunctions } from "../utility-functions";
import { FilterDefinition, SortDefinition, FiltersAndSorts, AdditionalDataDefinition } from "../filter-sort-utilities";
import { Observable } from "rxjs";



export abstract class HttpAbstractService {

    private classDescription = "HttpAbstractService";

    protected http: HttpClient;
    protected datepipe: DatePipe;
    protected entityConfiguration: EntityConfiguration;
    protected restApiBaseUrl: string;

    constructor(http: HttpClient, datepipe: DatePipe, entityConfiguration: EntityConfiguration, restApiBaseUrl: string) {
        this.http = http;
        this.datepipe = datepipe;
        this.entityConfiguration = entityConfiguration;

        // Se c'è la barra finale nell'url la togliamo
        if (restApiBaseUrl.endsWith("/")) {
            this.restApiBaseUrl = restApiBaseUrl.substr(0, restApiBaseUrl.length - 1);
        } else {
            this.restApiBaseUrl = restApiBaseUrl;
        }
    }



    getData(projection: string, initialFiltersAndSorts: FiltersAndSorts, lazyEventFiltersAndSorts: FiltersAndSorts, id?: any) {
        const functionName = "getDataNew";

        const queryString = this.buildQueryString(projection, initialFiltersAndSorts, lazyEventFiltersAndSorts);

        return this.getHttpCall(id, queryString);
    }



    protected buildQueryString(projection: string, initialFiltersAndSorts: FiltersAndSorts, lazyEventFiltersAndSorts: FiltersAndSorts): string {
        const functionName = "buildQueryStringNew";

        let res: string;
        const projectionQueryString = projection ? "projection=" + projection + "&" : "";
        let filterQueryString = "";
        let sortQueryString = "";
        let additionalDataQueryString = "";
        let paginationQueryString = "";

        const lazyLoadFilters: FilterDefinition[] = lazyEventFiltersAndSorts ? lazyEventFiltersAndSorts.filters : new Array<FilterDefinition>();
        const lazyLoadSorts: SortDefinition[] = lazyEventFiltersAndSorts ? lazyEventFiltersAndSorts.sorts : new Array<SortDefinition>();
        const lazyLoadAdditionalData: AdditionalDataDefinition[] = lazyEventFiltersAndSorts ? lazyEventFiltersAndSorts.additionalDatas : new Array<AdditionalDataDefinition>();
        const initialFilters: FilterDefinition[] = initialFiltersAndSorts ? initialFiltersAndSorts.filters : new Array<FilterDefinition>();
        const initialSorts: SortDefinition[] = initialFiltersAndSorts ? initialFiltersAndSorts.sorts : new Array<SortDefinition>();
        const initialAdditionalData: AdditionalDataDefinition[] = initialFiltersAndSorts ? initialFiltersAndSorts.additionalDatas : new Array<AdditionalDataDefinition>();

        let totalFilters: FilterDefinition[] = new Array<FilterDefinition>();
        let totalSorts: SortDefinition[] = new Array<SortDefinition>();
        let totalAdditionalDatas: AdditionalDataDefinition[] = new Array<AdditionalDataDefinition>();

        totalFilters = [...initialFilters, ...lazyLoadFilters];
        totalSorts = [...lazyLoadSorts, ...initialSorts];
        totalAdditionalDatas = [...lazyLoadAdditionalData, ...initialAdditionalData];


        totalFilters.forEach(element => {
            // se il filterMatchMode è un filtro su un campo non_stringa e l'unico operatore accettato è l'uguale (=)
            if (element.filterMatchMode === "") {
                filterQueryString += element.field + "=" + element.value + "&";
            } else {
                filterQueryString += element.field + "=$" + element.filterMatchMode + "(" + element.value + ")&";
            }
        });

        totalSorts.forEach(element => {
            sortQueryString += "sort=" + element.field + "," + element.orderMode + "&";
        });

        totalAdditionalDatas.forEach(element => {
            additionalDataQueryString += "additionalData=" + element.name + "=" + element.value + "&";
        })

        // quando voglio usare un limit fisso sul numero di elementi (o nessun limit, ovvero un limit molto alto) leggo da initialFiltersAndSorts.rows
        // e non lazyEventFiltersAndSorts.rows. Solo in questo caso initialFiltersAndSorts.rows è popolato
        if (initialFiltersAndSorts && initialFiltersAndSorts.rows && (!lazyEventFiltersAndSorts || !lazyEventFiltersAndSorts.first)) {
            paginationQueryString = "size=" + initialFiltersAndSorts.rows + "&";
        } else if (lazyEventFiltersAndSorts && lazyEventFiltersAndSorts.first && lazyEventFiltersAndSorts.rows) {
            paginationQueryString = "page=" + (lazyEventFiltersAndSorts.first / lazyEventFiltersAndSorts.rows) + "&size=" + lazyEventFiltersAndSorts.rows + "&";
        }

        res = projectionQueryString + filterQueryString + paginationQueryString + sortQueryString + additionalDataQueryString;

        return res;
    }



    protected getHttpCall(id: any, queryString: string) {
        const url = this.restApiBaseUrl + "/" + this.entityConfiguration.path + (id ? "/" + id : "") + "?" + queryString;
        return this.http.get<any>(url)
            .toPromise()
            .then(data => {
                if (data._embedded) {
                    for (let prop in data._embedded) {
                        UtilityFunctions.callFunctionForArray(UtilityFunctions.fixDateFields, data._embedded[prop]);
                    }
                }
                return data;
            })
            .catch(error => {
                console.log("ERROR", error);
            });
    }

    protected patchHttpCall(elementToUpdate: Entity, id: any) {
        const functionName = "patchHttpCall";
        const elementToUpdateClean = UtilityFunctions.fixFkFieldsForUpdate(elementToUpdate, this.datepipe);
        const url = this.restApiBaseUrl + "/" + this.entityConfiguration.path + "/" + id;
        const options = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        }
        return this.http.patch(url, elementToUpdateClean, options)
            .toPromise();
    }

    protected postHttpCall(entityToInsert: Entity) {
        const functionName = "postHttpCall";
        const elementToInsertClean = UtilityFunctions.fixFkFieldsForUpdate(entityToInsert, this.datepipe);
        const url = this.restApiBaseUrl + "/" + this.entityConfiguration.path;
        const options = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        }
        return this.http.post(url, elementToInsertClean, options)
            .toPromise();
    }

    protected deleteHttpCall(id: any): Promise<any> {
        const functionName = "deleteHttpCall";
        const url = this.restApiBaseUrl + "/" + this.entityConfiguration.path + "/" + id;
        const options = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        return this.http.delete(url, options)
            .toPromise();
    }

    protected batchHttpCall(batchOperations: BatchOperation[]): Observable<any> {
        const functionName = "batchHttpCall"
        batchOperations.forEach(batchOperation => batchOperation.entityBody = UtilityFunctions.fixFkFieldsForUpdate(batchOperation.entityBody, this.datepipe));
        const url = this.restApiBaseUrl + "/batch";
        const options = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        }
        return this.http.post(url, batchOperations, options);
    }

}

