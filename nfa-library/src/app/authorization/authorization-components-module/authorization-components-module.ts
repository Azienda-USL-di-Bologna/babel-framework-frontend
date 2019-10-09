import {ModuleWithProviders, NgModule} from '@angular/core';
import { AuthGuardProvider} from './auth-guards-provider/auth-guard-provider';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {LoginComponent} from './login-component/login-component';
import {HttpInterceptorProvider} from '@nfa/authorization';

/**
 * Modulo per la gestione dell'autenticazione e autorizzazione
 */
@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

  ],
  exports: [
    LoginComponent
  ],
  entryComponents: []

})
export class AuthorizationComponentsModule {

  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: AuthorizationComponentsModule,
      providers: [AuthGuardProvider,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpInterceptorProvider,
          multi: true,
        },]
    };
  }

}
