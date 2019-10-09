import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BroadcastProvider, ConfigurationsProvider} from '@nfa/core';
import {LoginProvider} from '@nfa/authorization';
// import * as sha256 from 'crypto-js/sha256';
// import * as encHex from 'crypto-js/enc-hex';
import {HttpClient} from '@angular/common/http';
import {NotificationMessageSeverity, ON_ACCOUNT_USER_LOGGED, ON_SEND_TOAST_NOTIFICATION_MESSAGE, ResponseDTO, UtenteDTO} from '@nfa/ref';
import {Router} from '@angular/router';
import {BaseProjectComponent} from '../../../shared-component-module/base-component/base-project-component';

@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.html',
  // styleUrls: ['./dettaglio-provvedimento.component.css']
})
export class LoginComponent  extends BaseProjectComponent implements OnInit {

  loginForm: FormGroup;
  recoveryForm: FormGroup;
  username: string;
  password: string;
  recoveryEmail: string;

 // @ViewChild('popupRecoveryPassword') popupRecoveryPassword: any;


  constructor(protected _configurationsProvider: ConfigurationsProvider, protected _broadcastProvider: BroadcastProvider,
              protected _loginprovider: LoginProvider, protected _fb: FormBuilder, protected _http: HttpClient, protected _router: Router) {
    super({broadcastProvider: _broadcastProvider, router: _router});

    this.loginForm = this._fb.group({
      username: ['', [<any>Validators.required, <any>Validators.minLength(4)]],
      password: ['', [<any>Validators.required, <any>Validators.minLength(4)]],
      keepConnected: ['']
    });
    this.recoveryForm = this._fb.group({
      email: ['', [<any>Validators.required, <any>Validators.email]]
    });
  }


  ngOnInit() {
    this.postLoginOperationRegistration();
  }

  login(event: any) {
    this._loginprovider.login(this.username , this.encryptPassword(this.password));
  }

  protected encryptPassword(password: string): string {
    // const hashedPassword = sha256(password).toString(encHex);
    // return hashedPassword;
    return password;
  }

  public openPopupRecoveryPassword(): void {
  //    this.popupRecoveryPassword.instance.show();
  }
  public closePopupRecoveryPassword(): void {
  //  this.popupRecoveryPassword.instance.hide();
  }


  public recoveryPassword(): void {
      const url: string = this._configurationsProvider.getConfiguration('base-url')
        + this._configurationsProvider.getConfiguration('request-recovery-password-relative-url');
    const formData = new FormData();
    formData.append('email', this.recoveryEmail);
      this._http.post(url, formData).subscribe((value: ResponseDTO) => {
        if (value.error == null) {
          this._broadcastProvider.broadcast(ON_SEND_TOAST_NOTIFICATION_MESSAGE, {
            message: 'Una email è stata inviata al tuo indirizzo per poseguire con il ripristino della password',
            severity: NotificationMessageSeverity.SUCCESS} );
          this.recoveryForm.reset();
          this.closePopupRecoveryPassword();
        } else {
          this._broadcastProvider.broadcast(ON_SEND_TOAST_NOTIFICATION_MESSAGE, {
            message: value.error.message.value,
            severity: NotificationMessageSeverity.ERROR} );
        }
      }, error2 => this.showErrorGenericMessage());
  }

  /**
   * Le operazioni da fare al postLogin
   */
  protected postLoginOperationRegistration(): void {
    // this._broadcastProvider.on(ON_ACCOUNT_USER_LOGGED).subscribe((utente: Utente) => {
    //   switch (utente.utenteRole) {
    //     // se ha ruolo azienda fai redirect su azienda dettagli
    //     case 'ROLE_AZIENDA':
    //       if (utente.entityIdOwner) {
    //         this.goToUrl(AZIENDE_DETAILS_PAGE_URL + '/' + utente.entityIdOwner);
    //       }
    //       break;
    //       // se il ruolo è editor devia sulla pagina dei focus
    //     case 'ROLE_MASTER_EDITOR':
    //     case 'ROLE_EDITOR':
    //       this.goToUrl(FOCUS_LIST_PAGE_URL);
    //   }
    // });
  }
}
