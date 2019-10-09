import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { NgForm } from "@angular/forms";
import { NtJwtLoginService } from "./nt-jwt-login.service";
import { NTJWTModuleConfig } from "./nt-jwt-login-module-config";
import { LoginType } from "./utility-functions";

@Component({
  selector: "lgn-nt-jwt-login",
  templateUrl: "./nt-jwt-login.component.html",
  styleUrls: ["./nt-jwt-login.component.scss"]
})
export class NtJwtLoginComponent implements OnInit, OnDestroy {

  private loginURL: string;

  public errorMessage = "";
  public show = true;
  public impersonatedUser: string;
  public aziendaImpersonatedUser: string;
  public realUser: string;

  constructor(public httpClient: HttpClient,
    private router: Router,
    private loginService: NtJwtLoginService,
    @Inject("loginConfig") private loginConfig: NTJWTModuleConfig
  ) {
  }

  public ngOnInit() {

    console.log("onInit() NtJwtLoginComponent");
    // setting degli URL host e porta per effettuare il login
    if (this.loginConfig.loginURL) {
      this.loginURL = this.loginConfig.loginURL;
    } else {
      const hostname: string = window.location.hostname;
      const port: string = hostname === "localhost" ? ":" + this.loginConfig.localhostPort : ":443";
      this.loginURL = window.location.protocol + "//" + hostname + port + this.loginConfig.relativeURL;
    }

    // console.log("stampo impersonatedUser", sessionStorage.getItem("impersonatedUser"));

    // controllo se deve essere effettuato il login con il cambia utente oppure un login "normale"
    this.impersonatedUser = this.loginService.getImpersonateUser();
    this.aziendaImpersonatedUser = this.loginService.getAziendaImpersonateUser();
    this.realUser = this.loginService.getRealUser();
    if (this.impersonatedUser) {
      // effettua il login passando l'utente impersonato
      console.log("impersonatedUser: ", this.impersonatedUser, " aziendaImpersonatedUser", this.aziendaImpersonatedUser);
      console.log("sto per eseguire il doLogin per cambio utente...");
      this.doLogin(this.impersonatedUser, this.aziendaImpersonatedUser);
      // eliminazione dalla session storage dell'utente impersonato
      // console.log("setto impersonatedUser a '' ");
      // this.loginService.setimpersonatedUser(null, null);
      this.loginService.isUserImpersonated = true;
    } else {
      console.log("sto per eseguire il doLogin senza cambio utente...");
      this.doLogin();
    }
  //   this.route.queryParams.subscribe((params: Params) => {
  //     console.log("dentro subscribe, ", params.hasOwnProperty('impersonatedUser'));

  //       console.log("chiamo login");
  //       console.log(params['impersonatedUser']);
  //       if (params.hasOwnProperty('impersonatedUser')) {

  //         //this.loginService.redirectTo = "/scrivania";
  //         this.loginService.clearSession();
  //         delete params['impersonatedUser'];
  //         this.doLogin(params['impersonatedUser']);
  //       } else {
  //         this.doLogin();
  //       }
  //  });

  }

  // effettua il login: se impersonatedUser != null allora si sta facendo il cambia utente
  public doLogin(impersonatedUser: string = null, idAzienda: string = null) {

    // prova a fare login usando SSO
    this.loginService.login(LoginType.SSO, impersonatedUser, null, null, idAzienda).subscribe(utente => {
      // mostra form per login in POST
      this.show = false;
      this.execRedirect();
      this.loginService.setLoggedUser$(utente);
    },
    err => {
      // mostra il form per fare il login in POST
      this.show = true;
    });
  }

  // effettua il login in POST con i dati compilati nel form presentato all'utente
  public loginPost(form: NgForm) {
    this.errorMessage = "";

    this.loginService.login(LoginType.Local, form.value.username, form.value.password, form.value.realUser).subscribe(utente =>  {
          this.execRedirect();
          this.loginService.setLoggedUser$(utente);
      },
      err => {
        this.errorMessage = "Errore: username e/o password errati";
      });
  }

  // esegui il redirect
  private execRedirect() {
    const redirectTo: string = this.loginService.redirectTo;
    if (redirectTo) {
      sessionStorage.removeItem("redirectTo");
      this.router.navigateByUrl(redirectTo);
    } else {
      this.router.navigate([this.loginConfig.homeComponentRoute], { queryParams: { reset: true } });
    }
  }

  ngOnDestroy() {
    console.log("onDestroy() NtJwtLoginComponent");
  }
}
