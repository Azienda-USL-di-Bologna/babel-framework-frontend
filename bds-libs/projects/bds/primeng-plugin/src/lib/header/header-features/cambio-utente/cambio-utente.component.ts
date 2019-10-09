import { Component, OnInit, ViewChild, Output, EventEmitter } from "@angular/core";
import { CambioUtenteService } from "./cambio-utente.service";
import { Utente, Persona } from "@bds/ng-internauta-model";
import {  SORT_MODES, AFFERENZA_STRUTTURA, PROJECTIONS, FILTER_TYPES } from "@bds/nt-communicator";
import { AutoComplete } from "primeng/autocomplete";
import { AdditionalDataDefinition, FilterDefinition, SortDefinition, FiltersAndSorts } from "@nfa/next-sdr";

@Component({
  selector: "prp-cambio-utente",
  templateUrl: "./cambio-utente.component.html",
  styleUrls: ["./cambio-utente.component.css"]
})
export class CambioUtenteComponent implements OnInit {

  text = "";
  personeSuggestions: Utente[] = [];
  selectedPersona: Utente = null;
  changeUserVisible = true;
  // cambioUtenteConfirmVisible: boolean = false;
  initialFilter: FiltersAndSorts;

  constructor(private cambioUtenteService: CambioUtenteService) { }

  @ViewChild("autoComplete", null) private autoComplete: AutoComplete;
  @Output("onUtenteSelectedEmitter") public onUtenteSelectedEmitter: EventEmitter<Utente> = new EventEmitter<Utente>();

  ngOnInit() {
    this.initialFilter = new FiltersAndSorts();
    this.initialFilter.addFilter(
      new FilterDefinition(
        "utenteStrutturaList.idAfferenzaStruttura.id", FILTER_TYPES.not_string.equals, AFFERENZA_STRUTTURA.DIRETTA));
    this.initialFilter.addSort(new SortDefinition("idPersona.descrizione", SORT_MODES.asc));
    this.initialFilter.addAdditionalData(new AdditionalDataDefinition("OperationRequested", "CambioUtente"));
  }

  search(str: string) {
    const filter: FiltersAndSorts = new FiltersAndSorts();
    filter.addFilter(new FilterDefinition("idPersona.descrizione", FILTER_TYPES.string.startsWithIgnoreCase, str));
    this.cambioUtenteService
      .getData(PROJECTIONS.utente.standardProjections.UtenteWithIdAziendaAndIdPersona, this.initialFilter, filter)
      .subscribe(k => {
        this.onClear();
        if (k && k.results && k.results.length > 0) {
        this.personeSuggestions = k.results;
          this.personeSuggestions.forEach(
            el => el.idPersona.descrizione += " (" + el.idPersona.codiceFiscale + ") " + "- " + el.idAzienda.nome);
      }

      switch (this.personeSuggestions.length) {
        case 0:
          const dummyUtente: Utente = new Utente();
          const dummyPersona: Persona = new Persona();
          dummyPersona.descrizione = "Nessun Risultato";
          dummyUtente.idPersona = dummyPersona;
          dummyUtente.id = null;
          this.personeSuggestions.push(dummyUtente);
          break;

      }
    });
  }

  onClear() {
    this.personeSuggestions = [];
    this.selectedPersona = null;
  }

  onClose() {
    this.changeUserVisible = false;
    this.onUtenteSelectedEmitter.emit(null);
  }

  onUtenteSelected(selected: Utente) {
    if (selected.id === null) { return; }
     this.selectedPersona = selected;
    // this.cambioUtenteConfirmVisible = true;
  }

  onUtenteSelectionConfirmed() {
    if ( this.autoComplete.value !== "" && this.autoComplete.value !== null ) {
      this.onUtenteSelectedEmitter.emit(this.selectedPersona);
    }
  }
  onKeyTabPressed(event: any) {
    event.preventDefault();
  }

}
