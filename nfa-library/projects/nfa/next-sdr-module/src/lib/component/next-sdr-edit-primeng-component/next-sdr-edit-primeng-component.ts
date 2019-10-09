import {
  ChangeDetectorRef,
  Component,
  ContentChild,
  EmbeddedViewRef,
  EventEmitter,
  Input,
  OnInit, Optional,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {EntityValidations, ValidationErrorsNextSDR} from '../../validations/validations';
import {Message, MessageService} from 'primeng/api';
import {Mode} from '../../definitions/definitions';
import { DialogNotificationMessage , NotificationMessageSeverity, ON_SEND_DIALOG_NOTIFICATION_MESSAGE} from '@nfa/ref';
import {BroadcastProvider} from '@nfa/core';
import {cloneDeep,isEqual} from 'lodash';


/**
 * Una componente speciale che si interfaccia con la classe {@link ServicePrimeNgTableSupport} per la gestione delle modifiche di una tabella
 */
@Component({
  selector: 'nextsdr-edit-primeng',
  templateUrl: './next-sdr-edit-primeng-component.html',
  // styleUrls: ['./dettaglio-provvedimento.component.css']
})
export class NextSdrEditPrimengComponent implements OnInit  {

  /*
      Le variabili di seguito devono esser considerate variabili interne all'app, vengono dichiarate pubbliche solo perchè servono
      a livello di html
   */
  public _cancelLabel = 'Cancella';
  public _saveLabel = 'Salva';
  public _hideFooter = false;
  public _disableSaveButton = false;
  public _P_MESSAGE_KEY = 'keyPMessageDialogEdit';
  public _entityValidations: EntityValidations;
  public _entity: any;
  public _mode: Mode = 'UPDATE';
  public _ctx = {entity: this._entity, mode: this._mode};
  public _checkBeforeExit = false;
  public _originalEntity: any;
  public _checkBeforeExitMessage = 'Sono presenti modifiche non salvate. Uscendo perderai le modifiche effettuate. Come desideri procedere ?';
  
/*
  ===============================================================================================================
 */

    /**
     * L'evento che viene chimata non appena si inizia l'editing
     */
  @Output() onStartEdit = new EventEmitter<NextSdrEditStartSaveCancel>();
    /**
     * metodo che viene chiamato quando l'editing finisce: si preme cancel
     * o si salva un entità correttamente senza che ci siano warning da visualizzare
     */
  @Output() onFinishEdit = new EventEmitter<NextSdrEditStartSaveCancel>();
    /**
     * evento che viene lanciato quando viene premuto il pulsante salva
     */
  @Output() onSave: EventEmitter<NextSdrEditStartSaveCancel> = new EventEmitter();
    /**
     * Evento che viene chiamato quando si preme il pulsante cancella
     */
  @Output() onCancel = new EventEmitter<NextSdrEditStartSaveCancel>();


  @ContentChild(TemplateRef) templateRef: TemplateRef<any>;


  @ViewChild('vc', {read: ViewContainerRef}) protected _vc: ViewContainerRef;
  // @ViewChild('emptyTemplate') protected _emptyTemplate: TemplateRef<any>;
  protected _actualView: EmbeddedViewRef<any>;

  @ViewChild('messageez') message: any;


  /**
   * La config di default
   */
  // protected _config: NextSdrEditPrimengConfig = {
  //
  // };


  public _template: TemplateRef<any>;

  constructor(protected _messageService: MessageService, protected _changeDetector: ChangeDetectorRef,
              @Optional() protected _broadcaster: BroadcastProvider) {
  }

  /**
   * Metodo per controllare l'abilitazione del save button
   * @param value
   */
  @Input('disableSaveButton')
  set disableSaveButton(value: boolean) {
    this._disableSaveButton = value;
  }

  /**
   * Per nascondere il footer che contiene i pulsanti di salvataggio e cancellazione
   * @param value
   */
  @Input('hideFooter')
  set hideFooter(value: boolean) {
    this._hideFooter = value;
  }

  /**
   * Setta l'entità su cui opererà la dialog
   * @param entity
   */
  @Input('entity')
  set entity(entity: any) {
    this._entity = entity;
    this._ctx.entity = entity;
  }

  /**
   * Setta la modalita della dialog se per inserimento o aggiornamento
   * @param value
   */
  @Input('mode')
  set mode(value: Mode) {
    this._mode = value;
    this._ctx.mode = this._mode;
  }

  /**
   * Il template da utilizzare nella dialog, conterrà i componenti per modificare le proprietà dell'entità
   * @param value
   */
  @Input('template')
  set template(value: TemplateRef<any>) {
    this._template = value;
    this.loadView();
  }
    /**
     * Metodo per cambiare la label del save button
     * @param value
     */
    @Input('saveLabel')
    set saveLabel(value: string) {
        this._saveLabel = value;
    }

    /**
     * Metodo per cambiare la label del save button
     * @param value
     */
    @Input('cancelLabel')
    set cancelLabel(value: string) {
        this._cancelLabel = value;
    }

  // @Input('config')
  // set config(value: NextSdrEditPrimengConfig) {
  //
  // }

    /**
     * Input per settare le validazioni da applicare all'entità che si modifica
     * @param value
     */
  @Input('entityValidations')
  set entityValidations(value: EntityValidations) {
    this._entityValidations = value;
  }
    /**
     * Input per settare se controllare prima di uscire se è stata modificata o meno l'entità
     * @param value
     */
  @Input('checkBeforeExit')
    set checkBeforeExit(value: boolean) {
        this._checkBeforeExit = value;
    }

    /**
     * Input per settare il messagio nel caso di uscita senza salvataggio modifiche
     * @param value
     */
    @Input('checkBeforeExitMessage')
    set checkBeforeExitMessage(value: string) {
        this._checkBeforeExitMessage = value;
    }



  protected loadView() {
    if (this._template) {
      this._actualView = this._template.createEmbeddedView(this._ctx);
    } else {
     // this._actualView = this._emptyTemplate.createEmbeddedView(null);
    }
    const viewRef = this._vc.insert(this._actualView);
  }

  ngOnInit(): void {
    this._messageService.clear(this._P_MESSAGE_KEY);

  }

  /**
   * Metodo da chiamare per iniziare editing
   */
  public startEdit() {
    if (this._checkBeforeExit) {
      //this._originalEntity = Object.assign({}, this._entity);
        this._originalEntity = cloneDeep(this._entity);
    }
    this.onStartEdit.emit({entity: this._entity, mode: this._mode});

  }

  /**
   * Metodo da chimare per chiudere l'editing
   */
  public finishEdit() {
    this._messageService.clear(this._P_MESSAGE_KEY);
    this.onFinishEdit.emit({entity: this._entity, mode: this._mode});
  }

  // ================== EVENTI FOOTER ==========================

  /**
   * Metodo che avvia il salvataggio dell'entità, o per meglio dire emette l'evento di salvataggio,
   * lo stesso metodo viene richiamato quando si preme il salva del componente
   */
  public save() {
    this.onSave.emit({entity: this._entity, mode: this._mode});

    // if (this.checkValidations()) {
    // }
  }

  /**
   * Metodo per cancellare l'operazione, emette il onCancel e chiude la dialog,
   * lo stesso metodo viene richiamato premendo il cancel del component.
   *
   * Verrà lanciato l'evento per mostrare la dialog di conferma solo nel caso in cui nel sistema ci sia come provider {@link BroadcastProvider}
   */
  public cancel() {
      if (this._broadcaster && this._checkBeforeExit && !isEqual(this._originalEntity, this._entity)) {
          const myMessage: DialogNotificationMessage = {
              buttons: [
                  {caption : 'Esci senza salvare' , type : 'SECONDARY',
                    callback: () => {this.onCancel.emit({entity: this._entity, mode: this._mode}); }},
                  {caption : 'Salva ed esci' , type : 'SUCCESS',
                    callback: () => {this.save(); }}
                  ],
              message: this._checkBeforeExitMessage,
              severity: NotificationMessageSeverity.WARNING,
          };
          this._broadcaster.broadcast(ON_SEND_DIALOG_NOTIFICATION_MESSAGE, myMessage);
      } else {
          this.onCancel.emit({entity: this._entity, mode: this._mode});
      }


  }



  /**
   * Metodo per visualizzare nella dialog gli errori di validazione
   * @param errors una lista di errori di validazione da visualizzare
   */
  public showValidationMessageError(errors: ValidationErrorsNextSDR[]) {
    if (errors && errors.length > 0) {
      const messages: Message[] = [];
      errors.forEach((error: ValidationErrorsNextSDR) => {
        const message: Message = {
          severity: error.validationSeverity === 'ERROR' ? 'error' : 'warn',
          summary: error.fieldName + ':',
          detail: error.message,
          key: this._P_MESSAGE_KEY
        };
        messages.push(message);
      });
      this._messageService.clear(this._P_MESSAGE_KEY);
      this._messageService.addAll(messages);
    }
  }

    // public deepEquals(x, y) {
    //     if (x === y) {
    //         return true; // if both x and y are null or undefined and exactly the same
    //     } else if (!(x instanceof Object) || !(y instanceof Object)) {
    //         return false; // if they are not strictly equal, they both need to be Objects
    //     } else if (x.constructor !== y.constructor) {
    //         // they must have the exact same prototype chain, the closest we can do is
    //         // test their constructor.
    //         return false;
    //     } else {
    //         for (const p in x) {
    //             if (!x.hasOwnProperty(p)) {
    //                 continue; // other properties were tested using x.constructor === y.constructor
    //             }
    //             if (!y.hasOwnProperty(p)) {
    //                 return false; // allows to compare x[ p ] and y[ p ] when set to undefined
    //             }
    //             if (x[p] === y[p]) {
    //                 continue; // if they have the same strict value or identity then they are equal
    //             }
    //             if (typeof (x[p]) !== 'object') {
    //                 return false; // Numbers, Strings, Functions, Booleans must be strictly equal
    //             }
    //             if (!this.deepEquals(x[p], y[p])) {
    //                 return false;
    //             }
    //         }
    //         for (const p in y) {
    //             if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
    //                 return false;
    //             }
    //         }
    //         return true;
    //     }
    // }
}

/**
 * Funzione (preso dalla rete) per controllare se due Object sono uguali
 */


/**
 * Classe di configurazione del componente {@link NextSdrEditPrimengDialogComponent}
 */
// export interface NextSdrEditPrimengConfig {
//
// }

export interface NextSdrEditStartSaveCancel {
  /**
   * L'entità su cui si opera
   */
  entity: any;
  /**
   * La modalita su cui si sta operando
   */
  mode: Mode;
}


