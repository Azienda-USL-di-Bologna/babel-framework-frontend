import { NgModule, ModuleWithProviders } from "@angular/core";
import { NtJwtLoginComponent } from "./nt-jwt-login.component";
import { NtJwtLoginService } from "./nt-jwt-login.service";
import { NTJWTModuleConfig } from "./nt-jwt-login-module-config";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { JwtInterceptor } from "./jwt.interceptor";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { LoginGuard } from "./guards/login.guard";
import { NoLoginGuard } from "./guards/no-login.guard";
import { RefreshLoggedUserGuard } from "./guards/refresh-logged-user.guard";
import { SessionManager } from "./session-manager";
import { NgIdleKeepaliveModule } from "@ng-idle/keepalive";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgIdleKeepaliveModule.forRoot(),
  ],
  declarations: [NtJwtLoginComponent],
  exports: [NtJwtLoginComponent]
})
export class NtJwtLoginModule {
  /** Un modulo, per convenzione, si inizializza tramite un metodo statico chiamato forRoot.
  * Al metodo forRoot è possibile passare dei parametri.
  * @param loginConfig parametro di configurazione del modulo
  * @returns il modulo inizializzato
  */
  public static forRoot(loginConfig: NTJWTModuleConfig): ModuleWithProviders {
    return {
      ngModule: NtJwtLoginModule,
      /**
        * si definiscono i service del modulo
        */
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: JwtInterceptor,
          multi: true
        },
        NtJwtLoginService,
        LoginGuard,
        NoLoginGuard,
        RefreshLoggedUserGuard,
        SessionManager,
        // tslint:disable-next-line:max-line-length
        { provide: "loginConfig", useValue: loginConfig } // in questo modo si definisce la variabile loginConfig in modo da porterla iniettare all'interno dei service
      ]
    };
  }
}
