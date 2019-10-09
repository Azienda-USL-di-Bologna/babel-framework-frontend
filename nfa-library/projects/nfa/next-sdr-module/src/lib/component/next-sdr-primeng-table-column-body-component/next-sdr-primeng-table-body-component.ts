import {Component, Input} from '@angular/core';
import {PTableColumn} from '../../definitions/definitions';
import {extractValueFromDotAnnotationOrFunction} from '../../utils/utility-functions';

/**
 * Componente per implementare il campo della colonna del body, ovvero quello che visualizza il valore vero e proprio
 * Esempio:
 *
 * <ng-template pTemplate="body" let-rowData let-columns="columns">
 *  <tr [pSelectableRow]="rowData">
 *    <td *ngFor="let col of columns">
 *      <app-nextsdr-primeng-table-column-body [column]="col" [rowData]="rowData"></app-nextsdr-primeng-table-column-body>
 *    </td>
 *  </tr>
 * </ng-template>
 */
@Component({
    selector: 'nextsdr-primeng-table-column-body',
    templateUrl: './next-sdr-primeng-table-body-component.html',
    // styleUrls: ['./dettaglio-provvedimento.component.css']
})
export class NextSdrEditPrimengTableColumnBodyComponent {

    public _col: PTableColumn;
    public _rowData: any;

    /**
     * La colonna su cui si sta agendo
     * @param value
     */
    @Input('column')
    set column(value: PTableColumn) {
        this._col = value;
    }

    /**
     * Il valore della riga su cui si sta operando
     * @param value
     */
    @Input('rowData')
    set rowData(value: any) {
        this._rowData = value;
    }


  public extractCorrectValueFromObjectAndDecode() {
      const extractedValue = this.extractCorrectValueFromObject();
      if (extractedValue !== null && extractedValue !== undefined && this._col.decode && this._col.decode.decodeValues
        && (this._col.decode.forShow || this._col.decode.forShow === null || this._col.decode.forShow === undefined)) {
        const decodedObject = this._col.decode.decodeValues
          .filter(value => value.key === extractedValue)
          .map(value => value.value)
          .pop();

        if (this._col.decode.decodeField)  {
            return extractValueFromDotAnnotationOrFunction(this._col.decode.decodeField, decodedObject);
        }
        return decodedObject;
      }
      return extractedValue;
  }

    /**
     * Il metodo controlla se il field contine una funzione esegue una funzione,
     * se il field contiene una dot annotation (string es: dominio.nome) crea la funzione e la esegue
     */
    public extractCorrectValueFromObject() {
        if (this._col.field) {
            return extractValueFromDotAnnotationOrFunction(this._col.field, this._rowData);
        } else {
            return null;
        }
    }

}


