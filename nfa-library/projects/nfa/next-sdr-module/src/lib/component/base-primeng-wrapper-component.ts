import {map} from 'rxjs/operators';
import {NextSdrServiceQueringWrapper, RestPagedResult} from '../definitions/definitions';
import {FiltersAndSorts, PagingConf} from '../definitions/filter-sort-definitions';

/**
 * Deve essere intesa come la classe di base che deve essere estesa per wrappare i componenti di primeng
 * e renderli funzionanti con {@link NextSDREntityProvider}
 */
export abstract class BasePrimengWrapperComponent {

  /**
   * funzione che setta il valore sul widget wrappato
   * @param value
   */
  protected abstract setValueOnWidget(value: any): void;

  /**
   * Funzione che torna l'istanze del widget wrappato
   */
  protected abstract getWidget(): any;

  /**
   * Funzione che restituisce {@link NextSdrServiceQueringWrapper}
   */
  protected abstract getNextSdrServiceQueringWrapper(): NextSdrServiceQueringWrapper;

  /**
   * Questa funzione dato un evento di ricerca, crea e torna un oggetto di tipo
   * {@link FiltersAndSorts} creato per matchare col widget wrappato
   * @param event
   */
  protected abstract createFilterAndSort(event: any): FiltersAndSorts;

  /**
   * Crea le impostazioni di paginazione
   * @param event
   */
  protected abstract createPagingConfig(event: any): PagingConf;


  /**
   * Funzione per trasformare le entità ricevute dal service in qualcosa di compatibile col widget su cui si stanno utilizzando
   * Default non effettua nessuna trasformazione ma ritorna il params
   * @param values
   */
  protected trasformValuesAfterQueringService(values: any[]): any[] {
    return values;
  }

  /**
   * La funzione per interrogare il service e caricare i risultati sul widget
   * @param event
   */
  protected loadValues(event: any) {
    if (this.getNextSdrServiceQueringWrapper()) {
      const lazyEventFiltersAndSorts = this.createFilterAndSort(event);
      const pageConfig = this.createPagingConfig(event);

      this.getNextSdrServiceQueringWrapper().service.getData(
        this.getNextSdrServiceQueringWrapper().projection,
        this.getNextSdrServiceQueringWrapper().initialFiltersAndSorts,
        lazyEventFiltersAndSorts, pageConfig)
        .pipe(
          map((resp: RestPagedResult) => {
            return resp.results;
          }),
          map((values: [any]) => {
            return this.trasformValuesAfterQueringService(values);
          })
        )
        .subscribe(value => {
          this.setValueOnWidget(value);
        });
    }
  }
}
