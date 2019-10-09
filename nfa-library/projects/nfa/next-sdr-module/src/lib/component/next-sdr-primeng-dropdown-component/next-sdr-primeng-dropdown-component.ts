import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MessageService, SelectItem} from 'primeng/api';
import {NextSDREntityProvider} from '../../providers/next-sdr-entity-provider';
import {FiltersAndSorts, PagingConf} from '../../definitions/filter-sort-definitions';
import {ExtractFromObject, NextSdrServiceQueringWrapper} from '../../definitions/definitions';
import {extractValueDotAnnotation} from '../../utils/utility-functions';
import {BasePrimengWrapperComponent} from '../base-primeng-wrapper-component';


@Component({
  selector: 'nextsdr-primeng-dropdown',
  templateUrl: './next-sdr-primeng-dropdown-component.html',
  // styleUrls: ['./dettaglio-provvedimento.component.css']
})
export class NextSdrEditPrimengDropDownComponent extends BasePrimengWrapperComponent implements OnInit, AfterViewInit {

  private _service: NextSDREntityProvider;
  private _nextSdrServiceQueringWrapper: NextSdrServiceQueringWrapper;
  public _widgetValue: any;
  public _appendTo;


  public _optionLabel: string;
  public _extractLabelFunction: ExtractFromObject = object => {
    return object;
  }
  // puro wrapper
 // protected _filterBy: string;

  @ViewChild('dropdown') protected _dropdown: any;




  @Output() valueChange = new EventEmitter<any>();

  @Input('serviceQueringWrapper')
  set nextSdrServiceQueringWrapper(value: NextSdrServiceQueringWrapper) {
    this._nextSdrServiceQueringWrapper = value;
  }

  @Input('optionLabel')
  set optionLabel(value: string) {
    this._optionLabel = value;
    this._extractLabelFunction = extractValueDotAnnotation(value, 'Label non trovata');
  }

  /**
    * Equivalende a appendTo di p-autocomplete
    * default false
  * @param value
  */
  @Input('appendTo')
  set appendTo(value) {
    this._appendTo = value;
  }

  @Input()
  get value(): any {
    return this._widgetValue;
  }

  set value(value: any) {
    this._widgetValue = value;
    this.valueChange.emit(value);
  }

  constructor(protected _messageService: MessageService) {
    super();
  }



  ngOnInit(): void {
  }

  //
  ngAfterViewInit(): void {
    this.loadValues(null);
    this._dropdown.onChange.subscribe((value) => this.value = value.value);
  }

  // protected loadValues() {
  //   if (this._nextSdrServiceQueringWrapper) {
  //     this._nextSdrServiceQueringWrapper.service.getData(
  //       this._nextSdrServiceQueringWrapper.projection,
  //       this._nextSdrServiceQueringWrapper.initialFiltersAndSorts,
  //       this._nextSdrServiceQueringWrapper.lazyEventFiltersAndSorts)
  //       .pipe(
  //         map((resp: RestPagedResult) => {
  //           return resp.results;
  //         }),
  //         map((values: [any]) => {
  //           return this.trasformValuesAfterQueringService(values);
  //         })
  //       )
  //       .subscribe(value => {
  //         this._dropdown.options = value;
  //       });
  //   }
  // }

  protected trasformValuesAfterQueringService(values: any[]): SelectItem[] {
    if (values) {
      return values.map(value => {
        const item: SelectItem = {
          label: this._extractLabelFunction(value),
          value: value
        };
        return item;
      });
    }
    return [];
  }

  protected createFilterAndSort(event: any): FiltersAndSorts {
    return new FiltersAndSorts();
  }


  protected createPagingConfig(event: any): PagingConf {
    return undefined;
  }

  protected getNextSdrServiceQueringWrapper(): NextSdrServiceQueringWrapper {
    return this._nextSdrServiceQueringWrapper;
  }

  protected getWidget(): any {
    return this._dropdown;
  }

  protected setValueOnWidget(value: any): void {
    this._dropdown.options = value;
  }


}


// export interface NextSdrEditPrimengDialogConfig {
//   /**
//    * L'header della dialog
//    */
//   header: string;
//   /**
//    * Se la dialog deve essere modal
//    */
//   modal: boolean;
//   /**
//    * Larghezza dialog
//    */
//   width: number;
//   /**
//    * Altezza dialog
//    */
//   height: number;
// }
