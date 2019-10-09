import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { NtJwtLoginService } from "../nt-jwt-login.service";
import { Utente } from "@bds/ng-internauta-model/bds-ng-internauta-model";
import { UtilityFunctions } from "../utility-functions";

@Injectable()
export class RefreshLoggedUserGuard implements CanActivate {

    constructor(private router: Router, private loginService: NtJwtLoginService, private route: ActivatedRoute) {}

    public canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        console.log("RefreshLoggedUserGuard - this.loginService.token: ", this.loginService.token);
        if (!this.loginService.token) {
            const tokenString: string = sessionStorage.getItem("token");
            console.log("tokenString: ", tokenString);
            if (tokenString && tokenString !== "") {
                this.loginService.token = tokenString;
            }
            const loginMethodString: string = sessionStorage.getItem("loginMethod");
            if (loginMethodString && loginMethodString !== "") {
                this.loginService.loginMethod = UtilityFunctions.getLoginTypeFromSessionStorageString(loginMethodString);
            }
            const redirectToString: string = sessionStorage.getItem("redirectTo");
            if (redirectToString && redirectToString !== "") {
                this.loginService.redirectTo = redirectToString;
            }
            const loggedUserString: string = sessionStorage.getItem("loggedUser");
            if (loggedUserString && loggedUserString !== "") {
                const loggedUser: Utente = UtilityFunctions.buildLoggedUser(JSON.parse(loggedUserString));
                this.loginService.setLoggedUser$(loggedUser);
            }
        }
        return true;
    }
}
