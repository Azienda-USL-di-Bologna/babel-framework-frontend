import {ModuleWithProviders, NgModule} from '@angular/core';
import {AccountProvider} from './providers/account-provider/account-provider';
import {LoginProvider} from './providers/login-providers/login-provider';
import {HttpInterceptorProvider} from './providers/http-interceptor-provider/http-interceptor-provider';
import {NfaAuthorizationModuleConfig} from '@nfa/ref';



@NgModule({
  declarations: [
  ],
  imports: [
  ],
  exports: [
  ],

  entryComponents: [],
  providers: [AccountProvider, LoginProvider, HttpInterceptorProvider]
})
export class NfaAuthorizationModule {

    public static forRoot(config: NfaAuthorizationModuleConfig): ModuleWithProviders {
        return {
            ngModule: NfaAuthorizationModule,
            providers: [
                AccountProvider,
                LoginProvider,
                HttpInterceptorProvider,
                {provide: 'nfaAuthorizationModuleConfig', useValue: config},
            ]
        };
    }
}
