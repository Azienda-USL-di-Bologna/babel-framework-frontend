import {Injectable} from '@angular/core';
import {DatePipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {ConfigurationsProvider} from '@nfa/core';
import {FORNITORI_SERVICE_URL} from '../../constants/app-urls';
import {NextSdrEntityConfiguration, NextSDREntityProvider} from '@nfa/next-sdr';
import {Observable} from 'rxjs';

@Injectable()
export class FornitoreService extends NextSDREntityProvider {

  constructor(protected _http: HttpClient, protected _datepipe: DatePipe, protected _configurationsProvider: ConfigurationsProvider) {
    super(_http, _datepipe, fornitoreEntity, _configurationsProvider.getConfiguration('base-url'));
  }

    public getAllFornitori():Observable<any>{
        const query = 'page=0&size=99999';

        const url = 'http://localhost:8080/sdr/fornitori?' + query;
        return this.http.get<any>(url);
    }
}

const fornitoreEntity: NextSdrEntityConfiguration = {
  path: FORNITORI_SERVICE_URL,
  standardProjections: {},
  customProjections: {},
  collectionResourceRel: 'fornitori',
  keyName: 'id',
};





