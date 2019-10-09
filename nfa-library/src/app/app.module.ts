import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ConfigurationsProvider, NfaCoreModule } from '@nfa/core';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { PagesModule } from './pages/pages-module';
import { TemplateModule } from './template/template-module';
import { RouterModule } from '@angular/router';
import { rootRouterConfig } from './app.routes';
import { AuthorizationComponentsModule } from './authorization/authorization-components-module/authorization-components-module';
import { ServicesModule } from './services/services-module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NfaAuthorizationModule } from '@nfa/authorization';
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import localeItExtra from '@angular/common/locales/extra/it';

registerLocaleData(localeIt, 'it-IT', localeItExtra);

/**
 * @param {ConfigurationsProvider} configurationsProvider
 * @returns {() => Promise<void>}
 */
export function init_configuration(configurationsProvider: ConfigurationsProvider) {
  return () => configurationsProvider.loadConfiguration();
}


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,

    RouterModule.forRoot(rootRouterConfig),

    NfaCoreModule
      .forRoot({ configurationPath: environment.config_url }),
    NfaAuthorizationModule.forRoot({
      showToastMessageOnLoginEvent: true,
      extractUserIdentifier: (responseUser: any) => responseUser.utenteDTO ? responseUser.utenteDTO.username : '',
      extractDataObject: (response: any) => response._embedded,
      extractErrorObject: (response: any) => response.error
    }),


    PagesModule,
    ServicesModule,
    TemplateModule,
    AuthorizationComponentsModule.forRoot(),
  ],
  providers: [
    ConfigurationsProvider,
    { provide: APP_INITIALIZER, useFactory: init_configuration, deps: [ConfigurationsProvider], multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
