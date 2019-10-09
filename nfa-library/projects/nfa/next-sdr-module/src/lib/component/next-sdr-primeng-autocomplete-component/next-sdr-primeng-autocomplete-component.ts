import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild, TemplateRef, forwardRef } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ExtractFromObject, FieldTypeColumn, NextSdrServiceQueringWrapper } from '../../definitions/definitions';
import { FILTER_TYPES, FilterDefinition, FiltersAndSorts, PagingConf, SortDefinition } from '../../definitions/filter-sort-definitions';
import { BasePrimengWrapperComponent } from '../base-primeng-wrapper-component';

@Component({
  selector: 'nextsdr-primeng-autocomplete',
  templateUrl: './next-sdr-primeng-autocomplete-component.html',
  // styleUrls: ['./dettaglio-provvedimento.component.css']

})
export class NextSdrEditPrimengAutocompleteComponent extends BasePrimengWrapperComponent implements OnInit, AfterViewInit {



  private _nextSdrServiceQueringWrapper: NextSdrServiceQueringWrapper;
  private _optionLabel: string;
  public _widgetValue: any;
  public _fieldType: FieldTypeColumn = 'string';
  // wrapper pure
  public _field;



  @Input('minLength') public _minLength = 3;
  @Input('dropdown') public _dropdown = false;
  @Input('multiple') public _multiple = false;

  @Input('placeholder') public _placeholder = null;
  @Input('disabled') public _disabled = false;
  @Input('dataKey') public _dataKey = null;
  @Input('emptyMessage') public _emptyMessage = null;
  @Input('size') public _size = null;
  @Input('appendTo') public _appendTo = null;
  @Input('inputStyle') public _inputStyle: any;
  @Input('inputStyleClass') public _inputStyleClass: any;


  /**
   * Il numero massimo di suggestion da visualizzare
   * DEFAULT {@literal 30}
   */
  @Input('maxSuggestions') public _maxSuggestion = 30;


  @Input('forceSelection') public _forceSelection = false;

  @Input() customTemplate: TemplateRef<any>;

  /**
   * Permette di indicare cosa o quale proprietà della selezione debba essere inserita nel value
   * Se ad esempio abbiamo visualizziamo la proprietà (alias field) nome di un oggetto Provincia,
   * ma vogliamo che la selezione non torni l'intero oggetto Provincia ma solo il codice (BO) scriveremo in questo campo {@literal codice}
   * TODO: NON usare ancoras da implementare!!!
   */
  // @Input('fieldValue') public _fieldValue: string | ExtractFromObject;

  //
  // private _extractLabelFunction: ExtractFromObject = object => {
  //   return object;
  // }


  @ViewChild('autocomplete') protected _autocomplete: any;


  constructor(protected _messageService: MessageService) {
    super();
  }

  /**
   * Le informazioni del servizio da dove leggere le informazioni sulle entità da visualizzare nel widget
   * @param value
   */
  @Input('serviceQueringWrapper')
  set nextSdrServiceQueringWrapper(value: NextSdrServiceQueringWrapper) {
    this._nextSdrServiceQueringWrapper = value;
  }

  /**
   * Il field che deve essere visualizzato dentro al widget per il selezionato,
   * nonchè quello che viene mostrato di default nelle suggestions.
   * Il parametro è da considerarsi OBBLIGATORIO
   * @param value
   */
  @Input('field')
  set field(value: string) {
    this._field = value;
  }

  /**
   * Utile per indicare il tipo di field del'entità che viene visualizzato come suggest,
   * serve per implementare la ricerca, nel caso di string è {@link  FILTER_TYPES.string.containsIgnoreCase}
   * in tutti gli altri casi è {@link FILTER_TYPES.not_string.equals}
   * Default a string
   * @param value
   */
  @Input('fieldType')
  set fieldType(value: FieldTypeColumn) {
    this._fieldType = value;
  }


  /**
   * funzione per manipolare i dati ritornati dal server
   * se passata viene fatto l'overide della funzione trasformValuesAfterQueringService
   */
  @Input('transformValuesAfterQuery')
  set transformValuesAfterQuery(value: () => any[]) {
    this.trasformValuesAfterQueringService = value;
  }

  /**
   * funzione per personalizzare la ricerca
   * se passata viene fatto l'overide della funzione createFilterAndSort
   */
  @Input('createQueryParams')
  set createQueryParams(value: () => FiltersAndSorts) {
    this.createFilterAndSort = value;
  }


  /**
  * L'ogetto su cui questo widget legge e scrive
  */
  @Input() value: any;

  /**
   * Serve per esporre il cambiamento del valore del componente
   */
  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Equivalente a style di p-autocomplete
   */
  @Input() style: any;

  /**
   * Equivalente a inputStyle di p-autocomplete
   */
  @Input() inputStyle: any;

  /**
   * Equivalente a formControlName di p-autocomplete
   */
  @Input('formControlName') public _formControlName: string;


  /**
   * Serve per esporre l'evento onSelect di p-autocomplete
   */
  @Output() onSelect: EventEmitter<any> = new EventEmitter<any>();


  ngOnInit(): void {
  }

  //
  ngAfterViewInit(): void {
    this._autocomplete.completeMethod.subscribe((event: any) => {
      this.loadValues(event);
    });
    this._autocomplete.onSelect.subscribe((selectedValue) => {
      // const fieldValueEstracted = (this._fieldValue && selectedValue) ?
      //     extractValueFromDotAnnotationOrFunction(this._fieldValue, selectedValue) : selectedValue;
      if (!this._multiple) {
        this.value = selectedValue;
      } else {
        this.value = this.value;
        // if (this.value) {
        //   this.value.push(selectedValue);
        // } else {
        //   this.value = [selectedValue];
        // }
      }
    });
  }



  protected createFilterAndSort(event: any): FiltersAndSorts {
    const result = new FiltersAndSorts();
    // result.first = 0;
    //  result.rows = this._maxSuggestion;
    if (event && event.query && this._field) {
      let filterDefinition: FilterDefinition;
      switch (this._fieldType) {
        case 'string':
          filterDefinition = new FilterDefinition(this._field, FILTER_TYPES.string.containsIgnoreCase, event.query);
          break;
        default:
          filterDefinition = new FilterDefinition(this._field, FILTER_TYPES.not_string.equals, event.query);

      }
      result.filters = [filterDefinition];
      result.sorts = [new SortDefinition(this._field, 'desc')];
    }

    return result;
  }


  protected createPagingConfig(event: any): PagingConf {
    return { mode: 'PAGE', conf: { page: 0, size: this._maxSuggestion } };
  }

  protected setValueOnWidget(value: any): void {
    this.getWidget().suggestions = value;
  }

  protected getWidget(): any {
    return this._autocomplete;
  }

  protected getNextSdrServiceQueringWrapper(): NextSdrServiceQueringWrapper {
    return this._nextSdrServiceQueringWrapper;
  }

}



/**
 * Classe di configurazione del componente {@link NextSdrEditPrimengDialogComponent}
 */
export interface NextSdrEditPrimengDialogConfig {
  /**
   * L'header della dialog
   */
  header: string;
  /**
   * Se la dialog deve essere modal
   */
  modal: boolean;
  /**
   * Larghezza dialog
   */
  width: number;
  /**
   * Altezza dialog
   */
  height: number;
}
