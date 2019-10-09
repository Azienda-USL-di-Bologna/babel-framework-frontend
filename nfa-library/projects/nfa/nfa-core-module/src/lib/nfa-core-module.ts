import {CommonModule} from '@angular/common';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {ConfigurationsProvider} from './providers/configurations-provider/configurations-provider';
import {BroadcastProvider} from './providers/broadcaster-provider/broadcaster-provider';
import {NfaCoreModuleConfig} from '@nfa/ref';

/**
 * Modulo per di servizi core che servono agli altri moduli
 */
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  exports: [
  ],
  entryComponents: [],
  providers: [ConfigurationsProvider, BroadcastProvider]
})
export class NfaCoreModule {

  public static forRoot(config: NfaCoreModuleConfig): ModuleWithProviders {
    return {
      ngModule: NfaCoreModule,
      providers: [
        ConfigurationsProvider,
        {provide: 'configurationPath', useValue: config.configurationPath},
        BroadcastProvider,
      ]
    };
  }

}
