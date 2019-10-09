import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonModule} from 'primeng/button';
import {AutoCompleteModule, CalendarModule, DropdownModule, MessageModule, MessagesModule} from 'primeng/primeng';
import {NextSdrEditPrimengDropDownComponent} from './component/next-sdr-primeng-dropdown-component/next-sdr-primeng-dropdown-component';
import {NextSdrEditPrimengAutocompleteComponent} from './component/next-sdr-primeng-autocomplete-component/next-sdr-primeng-autocomplete-component';
import {NextSdrEditPrimengComponent} from './component/next-sdr-edit-primeng-component/next-sdr-edit-primeng-component';
import {SdrExtractInstanceFromTemplateDirective} from './directive/sdr-extract-instance-template-directive';
import {SdrExtractElementFromTemplateDirective} from './directive/sdr-extract-element-template-directive';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {TriStateCheckboxModule} from 'primeng/tristatecheckbox';
import {TooltipModule} from 'primeng/tooltip';
import {NextSdrEditPrimengTableColumnBodyComponent} from './component/next-sdr-primeng-table-column-body-component/next-sdr-primeng-table-body-component';
import {NextSdrEditPrimengTableColumnSearchComponent} from './component/next-sdr-primeng-table-column-search-component/next-sdr-primeng-table-search-component';


/**
 * Modulo per le pagine dell'applicazione
 */
@NgModule({
    declarations: [
        NextSdrEditPrimengDropDownComponent,
        NextSdrEditPrimengAutocompleteComponent,
        NextSdrEditPrimengComponent,
        NextSdrEditPrimengTableColumnBodyComponent,
        NextSdrEditPrimengTableColumnSearchComponent,
        SdrExtractInstanceFromTemplateDirective,
        SdrExtractElementFromTemplateDirective,

    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ButtonModule,
        MessagesModule,
        MessageModule,
        DropdownModule,
        AutoCompleteModule,
        TriStateCheckboxModule,
        CalendarModule, 
        TooltipModule
    ],
    exports: [
        NextSdrEditPrimengDropDownComponent,
        NextSdrEditPrimengAutocompleteComponent,
        NextSdrEditPrimengComponent,
        NextSdrEditPrimengTableColumnBodyComponent,
        NextSdrEditPrimengTableColumnSearchComponent,
        SdrExtractInstanceFromTemplateDirective,
        SdrExtractElementFromTemplateDirective,

    ],
    entryComponents: [],
    providers: []
})
export class NextSdrModule {
}
