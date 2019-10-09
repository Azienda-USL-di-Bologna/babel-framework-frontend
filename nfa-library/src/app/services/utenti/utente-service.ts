import {Injectable} from '@angular/core';
import {DatePipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {ConfigurationsProvider} from '@nfa/core';
import {Observable} from 'rxjs';
import {UTENTI_SERVICE_URL} from '../../constants/app-urls';
import {NextSdrEntityConfiguration, NextSDREntityProvider} from '@nfa/next-sdr';

@Injectable()
export class UtenteService extends NextSDREntityProvider {

  constructor(protected _http: HttpClient, protected _datepipe: DatePipe, protected _configurationsProvider: ConfigurationsProvider) {
    super(_http, _datepipe, utenteEntity, _configurationsProvider.getConfiguration('base-url'));
  }
  
}

const utenteEntity: NextSdrEntityConfiguration = {
  path: UTENTI_SERVICE_URL,
  standardProjections: {},
  customProjections: {},
  collectionResourceRel: 'utenti',
  keyName: 'id',
};





