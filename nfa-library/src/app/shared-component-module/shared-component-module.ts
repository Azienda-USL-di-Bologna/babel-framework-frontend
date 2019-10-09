import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MenubarModule} from 'primeng/menubar';
 import {TieredMenuModule} from 'primeng/tieredmenu';
import {TableModule} from 'primeng/table';
import {ToastModule} from 'primeng/toast';
import {DialogModule} from 'primeng/dialog';
import {CalendarModule, CheckboxModule, DropdownModule, MessagesModule, PanelMenuModule, TabViewModule} from 'primeng/primeng';
import {ButtonModule} from 'primeng/button';
import {AuthorizationComponentsModule} from '../authorization/authorization-components-module/authorization-components-module';
import {PanelModule} from 'primeng/panel';
import {MessageModule} from 'primeng/message';
import {NextSdrEditPrimengAutocompleteComponent, NextSdrModule} from '@nfa/next-sdr';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
      CalendarModule,
    CheckboxModule,
    DropdownModule,
    PanelModule,
    MessagesModule,
    MessageModule,
      TabViewModule

  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // primeng
    MenubarModule,
    TableModule,
    ToastModule,
    DialogModule,
    PanelModule,
    MessagesModule,
    MessageModule,
    CheckboxModule,
    DropdownModule,
      CalendarModule,
    AuthorizationComponentsModule,
    TieredMenuModule,
    ButtonModule,
    PanelMenuModule,
    NextSdrModule,
      TabViewModule
  ],
  entryComponents: [],
  providers: []
})
export class SharedComponentsModule {
}
