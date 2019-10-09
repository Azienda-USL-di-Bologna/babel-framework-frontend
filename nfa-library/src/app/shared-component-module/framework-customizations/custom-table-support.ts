import {Mode, ServicePrimeNgTableSupport, ServicePrimeNgTableSupportConfig, ValidationErrorsNextSDR} from '@nfa/next-sdr';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {
    FilterDefinition, FiltersAndSorts, SORT_MODES,
    SortDefinition
} from '../../../../projects/nfa/next-sdr-module/src/lib/definitions/filter-sort-definitions';

export class CustomServicePrimeNgTableSupport extends ServicePrimeNgTableSupport {

  _entityKeyField: string;

  constructor(config: ServicePrimeNgTableSupportConfig, entityKeyField: string) {
    super(config);
    this._entityKeyField = entityKeyField;
  }

    /*protected buildLazyEventFiltersAndSorts(event: LazyLoadEvent, columns: any[], datepipe: DatePipe): FiltersAndSorts {
      console.log('buildLazyEventFiltersAndSorts');
      const lazyEventFiltersAndSorts = new FiltersAndSorts();
        if (event) {
            if (event.filters) {
                const keys: string[] = Object.keys(event.filters);
                for (const key of keys) {
                    const filterColumn = columns
                        .find(currCol => currCol.field === key);
                    if (event.filters[key] && (filterColumn.fieldType === 'Date' || filterColumn.fieldType === 'DateTime')) {
                        const filterMetadata: FilterMetadata = event.filters[key];
                        filterMetadata.value.forEach(element => {
                            /!* TODO: valutare se reperire il formato della data in altro modo (per ora è necessario che venga specificato quel formato
                               TODO: nella definizione dell'entità sul back-end.*!/
                            if (element) {
                                console.log('element',element);
                                console.log('filterColumn',filterColumn);
                                let pattern = 'yyyy-MM-dd';
                                pattern += (filterColumn.fieldType === 'DateTime') ? 'THH:mm:sss' : 'T00:00:00';
                                lazyEventFiltersAndSorts.addFilter(new FilterDefinition(key, filterColumn.filterMatchMode, datepipe.transform(element, pattern)));
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
                        lazyEventFiltersAndSorts.addSort(new SortDefinition(element, event.sortOrder === 1 ?
                            SORT_MODES.asc : SORT_MODES.desc));
                    });
                } else {
                    // per ora gestiamo solo il caso di un solo filtro (widget importati con ordinamento singolo)
                    lazyEventFiltersAndSorts.addSort(new SortDefinition(event.sortField, event.sortOrder === 1 ?
                        SORT_MODES.asc : SORT_MODES.desc));
                }
            }
            lazyEventFiltersAndSorts.first = event.first;
            lazyEventFiltersAndSorts.rows = event.rows;
        }

        return lazyEventFiltersAndSorts;
    }*/


  /**
   * Override del metodo che si occupa del salvataggio di un'entità
   * chiama le validazioni e lavora di comune accordo con la dialog di modifica se presente
   * registra sull'observable la chiamata della callback dell'AfterSave
   * @param entity l'entità da salvare
   * @param mode la modalità di salvataggio
   * @return l'observable da lanciare al salvataggio o se ci sono errori bloccanti la lista degli errori di validazione
   */
  public save(entity: any, mode: Mode): Observable<any> | ValidationErrorsNextSDR[] {
    if (this.onBeforeSave) {
      const forCallBack = {entity: entity, cancel: false};
      //this.onBeforeSave(forCallBack);
      // console.debug('sono cancel ' + forCallBack.cancel);
    }
    // mi faccio dare eventuali errori di validazione
    const errors: ValidationErrorsNextSDR[] = this.checkValidations(entity);
    // faccio stampare alla dialog eventuali errori di validazione
    if (this._editComponent && errors.length > 0 ){
      this._editComponent.showValidationMessageError(errors);
    }
    // controllo se ci sono errori bloccanti e se devo fare chiudere automaticamente la dialog
    const isBlocking = errors.map(value => value.isBlocking)
      .reduce((previousValue, currentValue) => previousValue || currentValue, false);
    const hideDialog = errors.length === 0;

    // se non ci sono errori bloccanti creo l'observable di savataggio
    if (!isBlocking) {
      if (mode === 'UPDATE') {
        const entityKey = this._service.getKeyOfEntity(entity);
        return this._service.patchHttpCall(entity, entityKey)
          .pipe(
            tap(value => {
              entity[this._entityKeyField] = entityKey;
              this.afterSaveUpdate(entity, mode, hideDialog);
            }),
            catchError(err => of(
              this._reqErrorCallback(err, 'UPDATE')
            )),
          );
      }
      if (mode === 'INSERT') {
        return this._service.postHttpCall(entity)
          .pipe(
            tap(value => {
              entity[this._entityKeyField] = value[this._entityKeyField];
              this.afterSaveUpdate(entity, mode, hideDialog);
            }),
            catchError(err => of(
              this._reqErrorCallback(err, 'INSERT')
            )),
          );
      }
    } else {
      // altrimenti torno gli errori di validazione
      return errors;
    }
  }






}
