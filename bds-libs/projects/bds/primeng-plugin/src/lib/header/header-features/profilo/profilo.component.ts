import { Component, OnInit } from "@angular/core";
import { Utente } from "@bds/ng-internauta-model";
import { DynamicDialogConfig } from "primeng/api";

@Component({
  selector: "prp-profilo",
  templateUrl: "./profilo.component.html",
  styleUrls: ["./profilo.component.css"]
})
export class ProfiloComponent implements OnInit {

  constructor( public config: DynamicDialogConfig) { }

  profilo = {} as ProfiloUtente;

  ngOnInit() {
    const utente: Utente = this.config.data;
    // console.log("UTENTE ", utente);
    this.profilo.nome = utente.idPersona.nome;
    this.profilo.cognome = utente.idPersona.cognome;
    this.profilo.email = utente.email;
    this.profilo.codiceFiscale = utente.idPersona.codiceFiscale;
    this.profilo.telefono = utente.telefono ? utente.telefono : "";
    this.profilo.aziende = [];
    utente.aziende.forEach(azienda => {
      this.profilo.aziende.push(azienda.nome);
    });
    this.profilo.ruoli = [];
    utente.ruoli.forEach(ruolo => {
      this.profilo.ruoli.push(ruolo.nomeBreve + " (" + ruolo.nome + ")");
    });
  }

}

interface ProfiloUtente {
  nome: string;
  cognome: string;
  email: string;
  codiceFiscale: string;
  telefono: string;
  aziende: string[];
  ruoli: string[];
}
