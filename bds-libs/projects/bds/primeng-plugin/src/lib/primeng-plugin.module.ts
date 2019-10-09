import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { HeaderComponent } from "../lib/header/header.component";
import { HeaderFeaturesComponent } from "../lib/header/header-features/header-features.component";
import { CambioUtenteComponent } from "../lib/header/header-features/cambio-utente/cambio-utente.component";
import { ProfiloComponent } from "../lib/header/header-features/profilo/profilo.component";

import { CommonModule } from "@angular/common";
import { SlideMenuModule } from "primeng/slidemenu";
import { DialogModule } from "primeng/dialog";
import { AutoCompleteModule } from "primeng/autocomplete";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";

import { DynamicDialogModule } from "primeng/dynamicdialog";
import { HeaderFeaturesService } from "./header/header-features/header-features.service";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";

@NgModule({
  imports: [
    CommonModule,
    SlideMenuModule,
    DialogModule,
    AutoCompleteModule,
    FormsModule,
    ButtonModule,
    CardModule,
    ToastModule
  ],
  declarations: [HeaderComponent, HeaderFeaturesComponent, CambioUtenteComponent, ProfiloComponent],
  exports: [HeaderComponent, HeaderFeaturesComponent, CambioUtenteComponent, ProfiloComponent],
  entryComponents: [ProfiloComponent],
  providers: [DynamicDialogModule, HeaderFeaturesService, MessageService]
})
export class PrimengPluginModule { }
