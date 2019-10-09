import {Component, Input} from '@angular/core';
import {ExtractFromObject, PTableColumn} from '../../definitions/definitions';
import {DatePipe} from '@angular/common';
import {SelectItem} from 'primeng/api';
import {extractValueDotAnnotation} from '../../utils/utility-functions';

/**
 * Componente per implementare il campo della colonna della ricerca
 * Esempio:
 * <tr>
 *  <th *ngFor="let col of columns" [ngSwitch]="col.fieldType">
 *    <app-nextsdr-primeng-table-search-body [column]="col" [tableComponent]="dtUtenti"> </app-nextsdr-primeng-table-search-body>
 *  </th>
 * </tr>
 */
@Component({
  selector: 'nextsdr-primeng-table-search-body',
  templateUrl: './next-sdr-primeng-table-search-component.html',
  // styleUrls: ['./dettaglio-provvedimento.component.css']
})
export class NextSdrEditPrimengTableColumnSearchComponent {

  public _col: PTableColumn | any;
  // public _rowData: any;
  public _tableComponent: any;
  public _locale: any;

  /**
   * La colonna su cui si sta operando
   * @param value
   */
  @Input('column')
  set column(value: PTableColumn | any) {
    this._col = value;
  }

  // @Input('rowData')
  // set rowData(value: any) {
  //   this._rowData = value;
  // }

  /**
   * La tabella su cui si sta operando
   * @param value
   */
  @Input('tableComponent')
  set tableComponent(value: any) {
    this._tableComponent = value;
  }


  @Input('locale')
  set locale(value: any) {
    this._locale = value;
  }
  /**
   * Evento che scatta in caso si preme il tasto presente nel calendario per eliminare la data.
   * Viene richiamato il metodo di filtro con parametro null, che svuota i filtri sulla data del campo.
   * @param event
   */
  onCalendarClear(event: any) {
    this.doDateFilter(null);
  }

  /**
   * Evento che scatta in caso l'utente scrive a mano qualcosa nel campo input del calendario.
   * @param event
   */
  onCalendarInput(event: any) {
    // Recupero dal parametro evento il testo inserito: se è vuoto svuoto i filtri, altrimenti ignoro quanto scritto
    // TODO: la cosa corretta sarebbe leggere il testo inserito e capire se è una data valida, in quel caso filtrare con tale data
    if (event.srcElement !== undefined) {
      if (event.srcElement.value && event.srcElement.value != null) {
        // se l'utente ha scritto qualcosa nel campo input, non effettuo nessun filtro
        return;
      } else {
        // Se l'utente ha eliminato la data scritta nell'input, devo annullare il filtro (passerò un array vuoto)
        this.doDateFilter(null);
      }
    }
  }

  /**
   * Evento che scatta quando si sceglie una specifica data dal calendario
   * @param event
   * TODO: Gestire anche la possibilità di filtro tra un range di due date (prevedendo eventualmente un altro FILTER_TYPES apposito)
   */
  onCalendarSelect(event: any) {
    // in questo caso il parametro event contiene la data scelta
    this.doDateFilter(event);
  }

  /**
   * Metodo che si occupa di effettuare il filtro su un campo data di una tabella
   * @param dateToFilter data da filtrare
   */
  doDateFilter(dateToFilter: Date) {
    // In caso di filtro sulle date, è necessario passare al metodo filter della tabella un array di date
    const dateFilters = [];
    if (dateToFilter) {
      dateFilters.push(dateToFilter);
    }
    this.startSearch(dateFilters);
    //  this._tableComponent.filter(dateFilters, this._col.field, this._col.filterMatchMode);
  }

  /**
   * Calcola il campo su cui fare la ricerca, privileggia searchField, se non lo trova allora restituisce field
   * @param col
   */
  public calculateSearchField(col: PTableColumn): any {
    if (col.decode && col.decode.searchField) {
      return col.decode.searchField;
    }
    return col.searchField ? col.searchField : col.field;
  }

  /**
   * Calcola se la ricerca è attiva su questo campo
   * @param col
   */
  public isSearchEnable(col: PTableColumn): boolean {
    return col.searchable === null || col.searchable === undefined || col.searchable;
  }


  /**
   * In base alle informazioni di _col stabilisce qualìè il widget giusto con cui fare la ricerca
   */
  public getWidgetToUse(): string {
    if (this._col && this._col.fieldType) {
      // se decodifica fare la dropdown
      if (this._col.decode && (this._col.decode.forSearch !== false)) {
        return 'dropdown';
      }

      switch (this._col.fieldType) {
        case 'boolean':
          return 'triStateCheckbox';
        case 'Date':
        case 'DateTime':
          return 'calendar';
        case 'string':
        case 'object':
        case 'number':
          return 'input';
        default:
          return null;
      }
    }
  }

  public createOptionsForDropdown(): SelectItem[] {
    let extractLabelFromObjectFunct: ExtractFromObject;
    if (this._col.decode.decodeField)  {
      if (typeof this._col.decode.decodeField === 'function') {
        extractLabelFromObjectFunct = (object => this._col.decode.decodeField(extractValueDotAnnotation('value')(object)));
      }
      if (typeof this._col.decode.decodeField === 'string') {
        extractLabelFromObjectFunct = extractValueDotAnnotation('value.' + this._col.decode.decodeField);
        // return this._rowData[this._col.field];
      }
    } else {
      extractLabelFromObjectFunct = extractValueDotAnnotation('value');
    }

    const result: SelectItem[] = this._col.decode.decodeValues
      .map(decodeValue => {
        return {
          label: extractLabelFromObjectFunct(decodeValue),
          value: decodeValue,
        };
      });

    return result;

}

  onChangeDropdownForDecode(dropdownValue: any) {
    let filterValue = '';
    if (dropdownValue !== null) {
      filterValue = dropdownValue.key;
    } else {
    }

    this.startSearch(filterValue);
  }

  startSearch(valueToSearch: any) {
    this._tableComponent.filter(valueToSearch, this.calculateSearchField(this._col), this._col.filterMatchMode);
  }

}


