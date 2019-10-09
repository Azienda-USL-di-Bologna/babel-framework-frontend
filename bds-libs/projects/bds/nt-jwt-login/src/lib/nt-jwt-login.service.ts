import { Injectable, Inject, OnDestroy } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { Utente } from "@bds/ng-internauta-model";
import { NTJWTModuleConfig } from "./nt-jwt-login-module-config";
import { HttpClient, HttpParams } from "@angular/common/http";
import { LoginType, UtilityFunctions } from "./utility-functions";
import { UtenteUtilities } from "./utente-utilities";

@Injectable({
  providedIn: "root"
})
export class NtJwtLoginService implements OnDestroy {
  private _token: string;
  private _loginMethod: LoginType;
  private _redirectTo: string;
  private _loggedUser$: BehaviorSubject<UtenteUtilities> = new BehaviorSubject(null);
  private _isUserImpersonated = false;
  private _from;
  private _settingsChangedNotifier$: Subject<any> = new Subject();
  private logoutUrlTemplate: string;

  constructor( @Inject("loginConfig") private loginConfig: NTJWTModuleConfig, private http: HttpClient) {}

  get loggedUser$(): Observable<UtenteUtilities> {
    return this._loggedUser$.asObservable();
  }

  setLoggedUser$(loggedUser: Utente, force = false) {
    if (loggedUser && (force || !this._loggedUser$.getValue())) {
      const jsonParametri = loggedUser.aziendaLogin.parametri;
      this.logoutUrlTemplate = jsonParametri["logoutUrl"] as string;
      this._loggedUser$.next(new UtenteUtilities(loggedUser, this, this.loginConfig, this.http));
      sessionStorage.setItem("loggedUser", JSON.stringify(loggedUser));
    } else if (this._loggedUser$.getValue() && !loggedUser) {
      this._loggedUser$.next(null);
      sessionStorage.removeItem("loggedUser");
    }
  }

  /**
   * setta l'url assoluto del login, è necessario perchè altrimenti nel caso in cui l'url non è costante
   * non si riesce a calcolarlo all'avvio e si va a settare quindi nell'ngOnInit dell'AppComponent
  */
  setloginUrl(url: string) {
    this.loginConfig.loginURL = url;
  }

  /**
   * setta l'url assoluto della servlet che scrive le impostazioni dell'applicazione su BD,
   * è necessario perchè altrimenti nel caso in cui l'url non è costante
   * non si riesce a calcolarlo all'avvio e si va a settare quindi nell'ngOnInit dell'AppComponent
  */
  setImpostazioniApplicazioniUrl(url: string) {
    this.loginConfig.setImpostazioniApplicazioniUrl = url;
  }

  get isUserImpersonated() {
    return this._isUserImpersonated;
  }

  set isUserImpersonated(val: boolean) {
    this._isUserImpersonated = val;
  }

  get token() {
    return this._token;
  }

  set token(token: string) {
    this._token = token;
  }

  get loginMethod() {
    return this._loginMethod;
  }

  set loginMethod(loginMethod: LoginType) {
    this._loginMethod = loginMethod;
  }

  get redirectTo() {
    return this._redirectTo;
  }

  get from() {
    return this._from;
  }

  set from(value: string) {
    this._from = value;
  }

  set redirectTo(redirectTo: string) {
    this._redirectTo = redirectTo;
  }

  setimpersonatedUser(impersonatedUser: string, realUser: string, aziendaImpersonatedUser) {
    if (impersonatedUser) {
      sessionStorage.setItem("impersonatedUser", impersonatedUser);
      sessionStorage.setItem("realUser", realUser);
      sessionStorage.setItem("aziendaImpersonatedUser", aziendaImpersonatedUser);
    } else {
      sessionStorage.removeItem("impersonatedUser");
      sessionStorage.removeItem("realUser");
      sessionStorage.removeItem("aziendaImpersonatedUser");
    }
  }

  getImpersonateUser(): string {
    let val = sessionStorage.getItem("impersonatedUser");
    if (val && val === "") {
      val = null;
    }
    return val;
  }

  getAziendaImpersonateUser(): string {
    let val = sessionStorage.getItem("aziendaImpersonatedUser");
    if (val && val === "") {
      val = null;
    }
    return val;
  }

  getRealUser(): string {
    let val = sessionStorage.getItem("realUser");
    if (val && val === "") {
      val = null;
    }
    return val;
  }

  // pulitura delle variabili di sessione
  clearSession() {
    this._token = null;
    this._loginMethod = null;
    this._redirectTo = null;
    sessionStorage.setItem("token", "");
    sessionStorage.setItem("loggedUser", "");
    sessionStorage.setItem("loginMethod", "");
    sessionStorage.setItem("redirectTo", "");
    sessionStorage.setItem("reloadLoggedUser", "");
    this.setLoggedUser$(null);
  }

  // richiesta di login
  // tslint:disable-next-line:max-line-length
  public login(loginType: LoginType, username: string = null, password: string = null, realUser: string = null, idAzienda: string = null): Observable<Utente> {
    switch (loginType) {
      case LoginType.Local:
        return this.loginLocal(username, password, realUser);
      case LoginType.SSO:
        return this.loginSSO(username, idAzienda);
    }
  }

  public logout(logoutRedirectRoute: string, disableCloseWindows: boolean = false) {
    if (disableCloseWindows || (!this.isUserImpersonated && (!this.from || this.from === ""))) {
      if (this.loginMethod !== LoginType.SSO) {
        this.clearSession();
        window.location.reload();
      } else {
        // prende l'url di logout dall'azienda dell'utente loggato
        this.clearSession();
        const lastSlash: number = window.location.href.lastIndexOf("/");
        const returnUrl: string = window.location.href.substring(0, lastSlash) + logoutRedirectRoute;
        window.location.href = this.logoutUrlTemplate.replace("[return-url]", returnUrl);
      }
    } else {
      this.clearSession();
      window.close();
    }
  }

  // richiesta di login con SSO in GET
  private loginSSO(impersonatedUser: string = null, idAzienda: string = null): Observable<Utente> {
    let requestParams: HttpParams = new HttpParams();

    // se ho passanto utente impersonato bisogna inserirlo nella richiesta
    requestParams = requestParams.append("application", this.loginConfig.applicazione);
    if (idAzienda) {
      requestParams = requestParams.append("azienda", idAzienda);
    }
    if (impersonatedUser) {
      requestParams = requestParams.append("impersonatedUser", impersonatedUser);
    }

    return new Observable(observer  =>  {
      this.http.get(this.loginConfig.loginURL, {params: requestParams}).subscribe(data => {
        observer.next(this.setDataLogin(data, LoginType.SSO));
      });
    });
  }

  // richiesta di login in POST, usata per fare login se si è in locale
  private loginLocal(username: string, password: string, realUser: string): Observable<Utente> {
      return new Observable(observer  =>  {
        this.http.post(this.loginConfig.loginURL, {
            username: username,
            password: password,
            realUser: realUser,
            application: this.loginConfig.applicazione
          }).subscribe(data => {
          observer.next(this.setDataLogin(data, LoginType.Local));
        });
      });
  }

  // setting dei dati nelle variabili e nella sessione con utente loggato
  private setDataLogin(data: any, loginMethod: LoginType): Utente {
    const loggedUser: Utente = UtilityFunctions.buildLoggedUser(data.userInfo);
    this.token = data.token;
    this._loginMethod = loginMethod;

    sessionStorage.setItem("loginMethod", UtilityFunctions.getLoginTypeStringForSessionStorage(loginMethod));
    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("loggedUser", JSON.stringify(data.userInfo));
    // this.setimpersonatedUser(loggedUser.username);
    return loggedUser;
  }

  public get settingsChangedNotifier$(): Subject<any> {
    return this._settingsChangedNotifier$;
  }

  ngOnDestroy() {
  }
}

