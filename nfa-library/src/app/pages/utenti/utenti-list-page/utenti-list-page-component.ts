import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {BaseProjectComponent} from '../../../shared-component-module/base-component/base-project-component';
import {UtenteService} from '../../../services/utenti/utente-service';
import {BroadcastProvider} from '@nfa/core';

import {MessageService} from 'primeng/api';
import {UtenteRole, UtenteRoleType} from '../../../entities/LoggedUserInfo';
import {DominioService} from '../../../services/utenti/dominio-service';
import {UtenteValidations} from '../../../entities/validations/UtenteValidations';
import {
  EntityValidations,
  extractValueDotAnnotation,
  FILTER_TYPES, FiltersAndSorts, Mode,
  NextSdrEditPrimengComponent,
  PTableColumn,
  ServicePrimeNgTableSupport
} from '@nfa/next-sdr';
import {NotificationMessage, NotificationMessageSeverity, ON_SEND_TOAST_NOTIFICATION_MESSAGE} from '@nfa/ref';
import {
  DialogButtonType,
  DialogNotificationMessage,
  ON_SEND_DIALOG_NOTIFICATION_MESSAGE
} from '../../../template/message-component/dialog-message-component/dialog-notification-message';

@Component({
  selector: 'app-utenti-list-page-component',
  templateUrl: './utenti-list-page-component.html',
  // styleUrls: ['./dettaglio-provvedimento.component.css']
})
export class UtentiListPageComponent extends BaseProjectComponent implements OnInit {

  parseUserRole = UtenteRole.GetRoleName;

  // Array che raccolgono le definizioni per le colonne delle tabelle di utenti e ruoli
  public _cols: PTableColumn[];
  public _rolesCols: PTableColumn[];

  // Oggetti di supporto per le tabelle di utenti e ruoli
  _userTableSupport: ServicePrimeNgTableSupport;
  _rolesTableSupport: ServicePrimeNgTableSupport;

  public _domainList: any[];
  public _rolesList: any[];

  // variabili ausiliarie
  private editing: boolean;



  @ViewChild('dtUtenti') dtUtenti: any;
  @ViewChild('editPanel') editPanel: any;
  @ViewChild('dtRuoli') dtRuoli: any;
  @ViewChild('dialogRuoli') dialogRuoli: any;

  @ViewChild('editComponent') editComponent: any;


  constructor(public _router: Router,
              protected utenteService: UtenteService,
              protected dominioService: DominioService,
              protected broadcaster:BroadcastProvider,
              public messageService: MessageService) {
    super({router: _router});
    this._broadcastProvider = broadcaster;

  }

  ngOnInit() {
    this._cols = [
      {
        field: 'username',
        header: 'Username',
        filterMatchMode: FILTER_TYPES.string.containsIgnoreCase,
        fieldType: 'string',
      },
      {
        field: 'email',
        header: 'Email',
        filterMatchMode: FILTER_TYPES.string.containsIgnoreCase,
        fieldType: 'string',
      },
      {
        field: 'nome',
        header: 'Nome',
        filterMatchMode: FILTER_TYPES.string.containsIgnoreCase,
        fieldType: 'string',
      },
      {
        field: 'cognome',
        header: 'Cognome',
        filterMatchMode: FILTER_TYPES.string.containsIgnoreCase,
        fieldType: 'string',
      },
      {
        field: 'enabled',
        header: 'Abilitato',
        filterMatchMode: FILTER_TYPES.not_string.equals,
        fieldType: 'boolean',
      }
    ];

    this._userTableSupport = new ServicePrimeNgTableSupport({
      service: this.utenteService,
      projection: 'utenteProjectionExtendedRuoliDominio',
      table: this.dtUtenti,
      editComponent: this.editComponent,
      // _detailSupport: this.editDialog,
      entityValidations: new EntityValidations([], UtenteValidations.validate),
      onError: (error: any, mode: Mode) => {
        this.showRequestErrorMessage(error);

      }
    });

    this._rolesCols = [
      {
        field: extractValueDotAnnotation('dominio.descrizione'),
        header: 'Dominio',
        filterMatchMode: FILTER_TYPES.not_string.equals,
        fieldType: 'object',
      },
      {
        field: UtenteRole.GetRoleName,

        header: 'Ruolo',
        filterMatchMode: FILTER_TYPES.string.containsIgnoreCase,
        fieldType: 'string',
      }
    ];

    this.dominioService.getData(null,new FiltersAndSorts(),new FiltersAndSorts()).subscribe(
      (domini:any) => {
        console.log('domini ottenuti',domini);
        this._domainList = domini.results;
      }
    );

    this._rolesList = Object.keys(UtenteRoleType).map((key:any) => {
      return {label : UtenteRole.GetRoleName(key), value : UtenteRoleType[key]};
    }  );

  }

  deleteUserRole(roleToRemove:any, utente:any){
    utente.ruoliPerDomini = utente.ruoliPerDomini.filter(function( el ) {
      return el.id !== roleToRemove.id;
    });
  }

  addUserRole(utente:any){

    utente.ruoliPerDomini.push({});
  }
}
