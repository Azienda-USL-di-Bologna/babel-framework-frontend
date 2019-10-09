import { HttpEvent , HttpRequest, HttpResponse , HttpHandler , HttpInterceptor, HttpErrorResponse } from "@angular/common/http";
import { Observable, of, EMPTY, throwError } from "rxjs";
import { NtJwtLoginService } from "./nt-jwt-login.service";
import { Injectable, Inject } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {tap, catchError, map} from 'rxjs/operators';
import { NTJWTModuleConfig } from "./nt-jwt-login-module-config";


@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(@Inject("loginConfig") private loginConfig: NTJWTModuleConfig,
                private loginService: NtJwtLoginService,
                private router: Router) {
    }

    public static getToken(): string {
        // console.log("getToken() : " + JSON.stringify(sessionStorage.getItem("token")));
        return sessionStorage.getItem("token");
    }

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // const token = JwtInterceptor.getToken();
        const token = this.loginService.token;
        if (token) {
            request = request.clone({
                setHeaders: {Authorization: `Bearer ${token}`, Application: this.loginConfig.applicazione}
            });
        }
        return next.handle(request).pipe(
            catchError((err: HttpErrorResponse) => {
                    if (err.status === 401) {
                        this.loginService.clearSession();
                        this.loginService.redirectTo = this.router.url;
                        sessionStorage.setItem("redirectTo", this.loginService.redirectTo);
                        this.router.navigateByUrl(this.loginConfig.loginComponentRoute);
                        return EMPTY;
                    } else {
                        return throwError(err);
                    }
                }
            ));
        //     map(err => {
        //       let message: string;
        //        //this.toastr.error(`${message}`, "Application Error");
        //        throwError("errore");
        //     })
        //   );
            // catchError(err) => {
            //     // (event: any) => {
            //     //     console.log("TOKEN VALID NO ERROR");
            //     //     if(event instanceof HttpResponse){
            //     //         console.log("TOKEN VALID");
            //     //     // if the token is valid
            //     //     }
            //     // },
            //     // (err: any) => {
            //         console.log("TOKEN NOT VALID ERROR");
            //         // if the token has expired.
            //         if(err instanceof HttpErrorResponse){
            //             if(err.status === 401){
            //                 console.log("TOKEN NOT VALID");
            //                 // this is where you can do anything like navigating
            //             }
            //             this.router.navigateByUrl('/login');
            //         }
            //     }
            // );
        // )
    }
}
