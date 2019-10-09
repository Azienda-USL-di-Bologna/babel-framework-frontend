import {Injectable} from '@angular/core';
import {DatePipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {ConfigurationsProvider} from '@nfa/core';
import {TIPI_EVENTO_URL} from '../../constants/app-urls';
import {NextSdrEntityConfiguration, NextSDREntityProvider} from '@nfa/next-sdr';
import {Observable} from 'rxjs';

@Injectable()
export class TipoEventoService extends NextSDREntityProvider{

  constructor(protected _http: HttpClient, protected _datepipe: DatePipe, protected _configurationsProvider: ConfigurationsProvider) {
    super(_http, _datepipe, tipoEventoEntity, _configurationsProvider.getConfiguration('base-url'));
  }

    public getAllTipi():Observable<any>{
        const query='page=0&size=99999';

        const url = 'http://localhost:8080/sdr/tipi_evento?' + query;
        return this.http.get<any>(url);
    }
}

const tipoEventoEntity: NextSdrEntityConfiguration = {
  path: TIPI_EVENTO_URL,
  standardProjections: {},
  customProjections: {},
  collectionResourceRel: 'tipi_evento',
  keyName: 'id',
};





