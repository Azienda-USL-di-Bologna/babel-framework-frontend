import {ActivatedRoute, Router} from '@angular/router';
import {BroadcastProvider, ConfigurationsProvider} from '@nfa/core';

export interface BaseComponentConfigurator {
  broadcastProvider?: BroadcastProvider;
  activatedRoute?: ActivatedRoute;
  router?: Router;
  configurationsProvider?: ConfigurationsProvider;
}

