import { NgModule } from '@angular/core';
import { AmministrazioneMessaggiComponent } from '../lib/messaggero/amministrazione-messaggi/amministrazione-messaggi.component';
import { PopupMessaggiComponent } from './messaggero/popup-messaggi/popup-messaggi.component';
import { PopupMessaggiService } from './messaggero/popup-messaggi/popup-messaggi.service';

/*** PrimeNG Imports ***/
import { AutoCompleteModule } from "primeng/autocomplete";
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from "primeng/calendar";
import { CheckboxModule } from "primeng/checkbox";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { MultiSelectModule } from 'primeng/multiselect';
import { PanelModule } from "primeng/panel";
import { SelectButtonModule } from "primeng/selectbutton";
import { SliderModule } from 'primeng/slider';
import { TableModule } from "primeng/table";
import { TabViewModule } from "primeng/tabview";
import { InputTextareaModule } from "primeng/inputtextarea";
import { ToastModule } from "primeng/toast";
import { TooltipModule } from "primeng/tooltip";

import { CommonModule } from "@angular/common";
import { DatePipe } from "@angular/common";
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DialogService, DynamicDialogConfig } from 'primeng/api';
import { SanitizeHtmlPipe } from './sanitize-html-pipe';

@NgModule({
  imports: [
    AutoCompleteModule,
    ButtonModule,
    CalendarModule,
    CheckboxModule,
    CommonModule,
    ConfirmDialogModule,
    DialogModule,
    DropdownModule,
    FormsModule,
    InputTextModule,
    MultiSelectModule,
    PanelModule,
    ReactiveFormsModule,
    SelectButtonModule,
    SliderModule,
    TableModule,
    TabViewModule,
    InputTextareaModule,
    ToastModule,
    TooltipModule,
    DynamicDialogModule
  ],
  declarations: [
    AmministrazioneMessaggiComponent,
    PopupMessaggiComponent,
    SanitizeHtmlPipe
  ],
  exports: [
    AmministrazioneMessaggiComponent,
    PopupMessaggiComponent
  ],
  providers: [DialogService, DatePipe, PopupMessaggiService],
  entryComponents: [PopupMessaggiComponent]
})
export class CommonComponentsModule { }
