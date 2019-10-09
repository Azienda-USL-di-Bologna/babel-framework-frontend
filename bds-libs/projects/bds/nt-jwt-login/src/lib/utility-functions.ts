import { Utente } from "@bds/ng-internauta-model";
import { Params, Router } from "@angular/router";
import { NtJwtLoginService } from "./nt-jwt-login.service";

export enum LoginType {
  Local,
  SSO
}

export class UtilityFunctions {

    // ritorna il tipo di login in stringa
    public static getLoginTypeStringForSessionStorage(loginType: LoginType): string {
      switch (loginType) {
        case LoginType.Local: return "local";
        case LoginType.SSO: return "sso";
        default: return undefined;
      }
    }

    // ritorna il tipo di login dalla stringa
    public static getLoginTypeFromSessionStorageString(loginType: string): LoginType {
      switch (loginType) {
        case "local": return LoginType.Local;
        case "sso": return LoginType.SSO;
        default: return undefined;
      }
    }

    // creazione dell'utente loggato a partire da UserInfo
    public static buildLoggedUser(userInfo: any): Utente {
      const loggedUser: Utente = new Utente();
      for (const key in userInfo) {
        if (userInfo.hasOwnProperty(key)) {
          loggedUser[key] = userInfo[key];
        }
      }
      return loggedUser;
    }

    public static manageChangeUserLogin(params: Params, loginService: NtJwtLoginService, router: Router, loginRoute: string) {
      console.log("dentro subscribe, ", params.hasOwnProperty("impersonatedUser"));
      console.log("chiamo login");
      console.log("impersonateUser: ", params["impersonatedUser"], "on azienda: ", params["aziendaImpersonatedUser"]);

      if (params.hasOwnProperty("from")) {
        loginService.from = params["from"].trim();
      }

      // se nei params c'è la proprietà impersonatedUser, allora pulisci la sessione, setta nella sessionStorage l'utente impersonato
      // e cancellalo dai params
      if (params.hasOwnProperty("impersonatedUser")) {
        loginService.clearSession();
        // tslint:disable-next-line:max-line-length
        loginService.setimpersonatedUser( params["impersonatedUser"].trim(),
                                          params["realUser"] ? params["realUser"].trim() : null,
                                          params["aziendaImpersonatedUser"] ? params["aziendaImpersonatedUser"].trim() : null);

        // eliminazione dai query params di impersonatedUser
        // this.loginService.redirectTo = this.router.routerState.snapshot.url.replace(/(?<=&|\?)impersonatedUser(=[^&]*)?(&|$)/, "");
        loginService.redirectTo = UtilityFunctions.removeQueryParams(router.routerState.snapshot.url, "realUser");
        loginService.redirectTo = UtilityFunctions.removeQueryParams(loginService.redirectTo, "impersonatedUser");
        loginService.redirectTo = UtilityFunctions.removeQueryParams(loginService.redirectTo, "aziendaImpersonatedUser");
        console.log("STATE: ", loginService.redirectTo);
        router.navigate([loginRoute]);
      }
    }

    /**
     * rimuove dall'url il query param passato
     * @param url
     * @param paramToRemove query param da rimuovere
     */
    public static removeQueryParams(url: string, paramToRemove: string): string {
      const splittedUrl: string[] = url.split("?");
      if (splittedUrl.length === 1) {
        return url;
      }
      let purgedQueryParams = "";
      const queryParams: string = splittedUrl[1];
      const splittedQueryParams: string[] = queryParams.split("&");
      for (let i = 0; i < splittedQueryParams.length; i++) {
        const splittedQueryParam: string[] = splittedQueryParams[i].split("=");
        if (splittedQueryParam[0] !== paramToRemove) {
          purgedQueryParams += splittedQueryParams[i] + "&";
        }
      }

      if (purgedQueryParams !== "") {
        return splittedUrl[0] + "?" + purgedQueryParams.substr(0, purgedQueryParams.length - 1);
      } else {
        return splittedUrl[0];
      }
    }
}
