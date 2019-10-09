import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NextSDREntityProvider } from "@nfa/next-sdr";
import { DatePipe } from "@angular/common";
import { getInternautaUrl, BaseUrlType } from "../utils/internauta-utils";
import { ENTITIES_STRUCTURE } from "../entities/definitions";

@Injectable({
  providedIn: "root"
})
export class AziendaService extends NextSDREntityProvider {

  constructor(protected _http: HttpClient, protected _datepipe: DatePipe) {
    super(_http, _datepipe, ENTITIES_STRUCTURE.baborg.azienda, getInternautaUrl(BaseUrlType.Baborg));
  }
}
