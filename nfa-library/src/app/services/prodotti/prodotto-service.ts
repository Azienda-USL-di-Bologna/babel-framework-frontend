import {Injectable} from '@angular/core';
import {DatePipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {ConfigurationsProvider} from '@nfa/core';
import {PRODOTTI_SERVICE_URL} from '../../constants/app-urls';
import {Observable} from 'rxjs';
import {NextSdrEntityConfiguration, NextSDREntityProvider} from '@nfa/next-sdr';

@Injectable()
export class ProdottoService extends NextSDREntityProvider {

  constructor(protected _http: HttpClient, protected _datepipe: DatePipe, protected _configurationsProvider: ConfigurationsProvider) {
    super(_http, _datepipe, prodottoEntity, _configurationsProvider.getConfiguration('base-url'));
  }
}

const prodottoEntity: NextSdrEntityConfiguration = {
  path: PRODOTTI_SERVICE_URL,
  standardProjections: {},
  customProjections: {},
  collectionResourceRel: 'prodotti',
  keyName: 'id',
};





