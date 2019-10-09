import {Injectable} from '@angular/core';
import {DatePipe} from '@angular/common';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ConfigurationsProvider} from '@nfa/core';
import {Observable} from 'rxjs';
import {RuoloPerDominioDTO} from '../../entities/LoggedUserInfo';
import {DOMINI_SERVICE_URL} from '../../constants/app-urls';
import {NextSdrEntityConfiguration, NextSDREntityProvider} from '@nfa/next-sdr';

@Injectable()
export class DominioService extends NextSDREntityProvider {

  constructor(protected _http: HttpClient, protected _datepipe: DatePipe, protected _configurationsProvider: ConfigurationsProvider) {
    super(_http, _datepipe, dominioEntity, _configurationsProvider.getConfiguration('base-url'));
  }


  public selectDomainRole(selectedDomainRole:RuoloPerDominioDTO): Observable<any>{
    const url=this.restApiBaseUrl+'/scelta-dominio';
    const headers = new HttpHeaders({
      'Content-Type' : 'application/x-www-form-urlencoded'
    });
    const options = {
      headers
    };
    const requestParams = 'idRuoloPerDominio='+selectedDomainRole.id+'&keepConnected=true';

    return this.http.post(url, requestParams,options);
  }

}

const dominioEntity: NextSdrEntityConfiguration = {
  path: DOMINI_SERVICE_URL,
  standardProjections: {},
  customProjections: {},
  collectionResourceRel: 'domini',
  keyName: 'id',
};





