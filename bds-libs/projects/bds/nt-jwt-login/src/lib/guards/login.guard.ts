import {Inject, Injectable} from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs";
import {NTJWTModuleConfig} from "../nt-jwt-login-module-config";
import { NtJwtLoginService } from "../nt-jwt-login.service";
import { UtilityFunctions, LoginType } from "../utility-functions";
import { Utente } from "@bds/ng-internauta-model";
import { SessionManager } from "../session-manager";

@Injectable()
export class LoginGuard implements CanActivate {

    constructor(@Inject("loginConfig") private loginConfig: NTJWTModuleConfig,
                private router: Router,
                private loginService: NtJwtLoginService,
                private sessionManager: SessionManager) {}

    public canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        console.log("LoginGuard - this.loginService.token: ", this.loginService.token);
        if (!this.loginService.token) {

            if (!( state.url.substring( 0, this.loginConfig.loginComponentRoute.length ) === this.loginConfig.loginComponentRoute)) {
                this.loginService.redirectTo = state.url;
                sessionStorage.setItem("redirectTo", state.url);
            }
            console.log("LoginGuard: redirect to login()");
            this.router.navigate([this.loginConfig.loginComponentRoute]);
            return false;
        } else {
            const reloadLoggedUserString = sessionStorage.getItem("reloadLoggedUser");
            console.log("LoginGuard - reloadLoggedUser: ", reloadLoggedUserString);
            const reloadLoggedUser = !reloadLoggedUserString || reloadLoggedUserString === "" || reloadLoggedUserString === "true";
            if (reloadLoggedUser) {
                console.log("LoginGuard - loginMethod: ", this.loginService.loginMethod);
                console.log("LoginGuard - impersonateUser(): ", this.loginService.getImpersonateUser());
                console.log("LoginGuard - aziendaImpersonateUser()(): ", this.loginService.getAziendaImpersonateUser());
                if (this.loginService.loginMethod === LoginType.SSO) {
                    // tslint:disable-next-line:max-line-length
                    this.loginService.login(this.loginService.loginMethod, this.loginService.getImpersonateUser(), null, null, this.loginService.getAziendaImpersonateUser()).subscribe((utente: Utente) => {
                        console.log("LoginGuard - new utente: ", utente);
                        this.loginService.setLoggedUser$(utente, true);
                    });
                    sessionStorage.setItem("reloadLoggedUser", "false");
                }
                // eliminazione dalla session storage dell'utente impersonato
                console.log("setto impersonatedUser a '' ");
                this.loginService.setimpersonatedUser(null, null, null);
            }
            if (this.loginConfig.sessionExpireSeconds && this.loginConfig.sessionExpireSeconds > 0) {
                // tslint:disable-next-line:max-line-length
                this.sessionManager.setExpireTokenOnIdle(this.loginConfig.sessionExpireSeconds, this.loginConfig.pingInterval, this.loginConfig.logoutRedirectRoute);
            }
            return true;
        }
    }
}
