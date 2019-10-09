import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { HttpAbstractService, ENTITIES_CONFIGURATION, getInternautaUrl, BaseUrlType} from "@bds/nt-communicator";
import { DatePipe } from "@angular/common";
import { NextSDREntityProvider } from "@nfa/next-sdr";
import { ENTITIES_STRUCTURE } from "@bds/ng-internauta-model";

@Injectable({
  providedIn: "root"
})
export class CambioUtenteService extends NextSDREntityProvider {

  constructor(private httpClient: HttpClient, private datePipe: DatePipe) {
    super(httpClient, datePipe, ENTITIES_STRUCTURE.baborg.utente, getInternautaUrl(BaseUrlType.Baborg));
  }
}
