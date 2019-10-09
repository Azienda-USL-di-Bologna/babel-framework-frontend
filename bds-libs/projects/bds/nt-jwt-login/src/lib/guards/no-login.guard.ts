import {Inject, Injectable} from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs";
import {NTJWTModuleConfig} from "../nt-jwt-login-module-config";
import { NtJwtLoginService } from "../nt-jwt-login.service";

@Injectable()
export class NoLoginGuard implements CanActivate {

    constructor(@Inject("loginConfig") private loginConfig: NTJWTModuleConfig,
                private router: Router,
                private loginService: NtJwtLoginService) {}

    public canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (!this.loginService.token) {
            return true;
        } else {
            this.router.navigate([this.loginConfig.homeComponentRoute]);
            return false;
        }
    }
}
