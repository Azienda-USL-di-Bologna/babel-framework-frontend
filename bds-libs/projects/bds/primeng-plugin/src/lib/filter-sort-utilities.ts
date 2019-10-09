import { DatePipe } from "@angular/common";
import { LazyLoadEvent, FilterMetadata } from "primeng/api";
import {    FiltersAndSorts,
            FilterDefinition,
            SortDefinition,
            SORT_MODES, 
            PagingConf} from "@nfa/next-sdr";

/**
 * Metodo per la creazione di filtri compatibili con NextSdr
 * @param event l'evento di lazy loading della tabella
 * @param columns
 * @param datepipe
 */
export function buildLazyEventFiltersAndSorts(event: LazyLoadEvent, columns: any[], datepipe: DatePipe): FiltersAndSorts {
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
                    if (filterColumn.fieldType === "Date" || filterColumn.fieldType === "DateTime") {
                        const pattern = filterColumn.fieldType === "Date" ? "yyyy-MM-ddT00:00:00" : "yyyy-MM-ddTHH:mm:ss";
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

export function buildPagingConf(event: LazyLoadEvent, limitOffsetMode: boolean = false): PagingConf {
    if (event) {
        if (limitOffsetMode) {
            return {mode: 'LIMIT_OFFSET', conf: {limit: event.rows, offset: event.first}};
        } else {
            return {mode: 'PAGE', conf: {page: event.first / event.rows, size: event.rows}};
        }
    } else {
        return {mode: 'NONE'};
    }
}

/*
export function buildLazyEventFiltersAndSorts(event: LazyLoadEvent, columns: any[], datepipe: DatePipe): FiltersAndSorts {
    const classDescription = "FiltersAndSorts"
    const functionName = "buildLazyEventFiltersAndSorts";

    let lazyEventFiltersAndSorts = new FiltersAndSorts();

    if (event) {
        console.log(classDescription, functionName, "event:", event);

        if (event.filters) {
            const keys: string[] = Object.keys(event.filters);
            for (const key of keys) {
                const filterColumn = columns.find(currCol => currCol.field === key);
                if (event.filters[key] && (filterColumn.fieldType === "Date" || filterColumn.fieldType ==="DateTime" )) {
                    let filterMetadata: FilterMetadata = event.filters[key];

                    filterMetadata.value.forEach(element => {
                        if (element) {
                            let pattern = "yyyy-MM-dd";
                            pattern += (filterColumn.fieldType === "DateTime") ? "T00:00:00": "";
                            lazyEventFiltersAndSorts.addFilter(new FilterDefinition(key, FILTER_TYPES.not_string.equals, datepipe.transform(element, pattern)));
                        }
                    });
                    continue;
                }
                lazyEventFiltersAndSorts.addFilter(new FilterDefinition(key, event.filters[key].matchMode, event.filters[key].value));
            }
        }

        if (event.sortField) {
            const sortColumn = columns.find(currCol => currCol.field === event.sortField);
            // se è un campo calcolato potrebbe essere composto da più subfields e tutti questi concorrono nell'ordinamento
            // queste informazioni le prendo dalle columns che vengono passate dal componente dell'applicazione
            if (sortColumn.campoCalcolato === true) {
                sortColumn.subfields.array.forEach(element => {
                    lazyEventFiltersAndSorts.addSort(new SortDefinition(element, event.sortOrder === 1 ? SORT_MODES.asc : SORT_MODES.desc));
                });
            } else {
                // per ora gestiamo solo il caso di un solo filtro (widget importati con ordinamento singolo)
                lazyEventFiltersAndSorts.addSort(new SortDefinition(event.sortField, event.sortOrder === 1 ? SORT_MODES.asc : SORT_MODES.desc));
            }

        }

        lazyEventFiltersAndSorts.first = event.first;
        lazyEventFiltersAndSorts.rows = event.rows;
    }

    return lazyEventFiltersAndSorts;
}*/
