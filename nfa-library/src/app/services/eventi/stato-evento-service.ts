import {Injectable} from '@angular/core';
import {DatePipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {ConfigurationsProvider} from '@nfa/core';
import {STATI_EVENTO_URL} from '../../constants/app-urls';
import {NextSdrEntityConfiguration, NextSDREntityProvider} from '@nfa/next-sdr';

@Injectable()
export class StatoEventoService extends NextSDREntityProvider{

  constructor(protected _http: HttpClient, protected _datepipe: DatePipe, protected _configurationsProvider: ConfigurationsProvider) {
    super(_http, _datepipe, statoEventoEntity, _configurationsProvider.getConfiguration('base-url'));
  }
}

const statoEventoEntity: NextSdrEntityConfiguration = {
  path: STATI_EVENTO_URL,
  standardProjections: {},
  customProjections: {},
  collectionResourceRel: 'stati_evento',
  keyName: 'id',
};





