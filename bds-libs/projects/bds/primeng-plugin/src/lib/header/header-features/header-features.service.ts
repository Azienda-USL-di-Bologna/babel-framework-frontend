import { Injectable, OnInit } from "@angular/core";
import { NtJwtLoginService, LoginType, UtenteUtilities } from "@bds/nt-jwt-login";

@Injectable({
    providedIn: "root"
  })
  export class HeaderFeaturesService {

    public utenteConnesso: UtenteUtilities;
    private logoutUrlTemplate: string;

    constructor(private loginService: NtJwtLoginService) {
        // this.loginService.loggedUser$.subscribe((utente: UtenteUtilities) => {
        //     if (utente) {
        //         this.utenteConnesso = utente;
        //         const jsonParametri = utente.getUtente().aziendaLogin.parametri;
        //         this.logoutUrlTemplate = jsonParametri["logoutUrl"] as string;
        //     }
        // });
    }
  }
