import { NgModule } from "@angular/core";
import { AmministrazioneMessaggiService } from "./services/amministrazione-messaggi.service";
import { ApplicazioneService } from "./services/applicazione.service";
import { AziendaService } from "./services/azienda.service";
import { StrutturaService } from "./services/struttura.service";
import { TemplateMessaggiService } from "./services/template-messaggi.service";
import { UtenteService } from "./services/utente.service";
import { PersonaService } from "./services/persona.service";

@NgModule({
  imports: [
  ],
  declarations: [],
  exports: [],
  providers: [
    AmministrazioneMessaggiService, ApplicazioneService, AziendaService, StrutturaService, TemplateMessaggiService, UtenteService,
    PersonaService
  ]
})
export class NgInternautaModelModule { }
