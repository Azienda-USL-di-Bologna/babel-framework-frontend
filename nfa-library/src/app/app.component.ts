import {Component, OnInit} from '@angular/core';
import {BroadcastProvider, ConfigurationsProvider} from '@nfa/core';
import {
  ON_ACCOUNT_USER_LOGGED,
  ON_ACCOUNT_USER_REMOVED
} from '@nfa/ref';
import {AccountProvider} from '@nfa/authorization';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // se non si visualizza niente potrebbe esser la causa questo flag
  _readyToRender = false;
  _accountUserLogged: boolean;

  constructor(protected _configurationProvider: ConfigurationsProvider, protected ac: AccountProvider,
              protected _broadcastProvider: BroadcastProvider) {
    this.configLocalization();

  }

  ngOnInit() {
    this._accountUserLogged = false;
    //this.registerAccountEvent();

  }

  protected registerAccountEvent(): void {
    this._broadcastProvider.on(ON_ACCOUNT_USER_LOGGED).subscribe( value => {
      this._accountUserLogged = true;
      this._readyToRender = true;
    });
    this._broadcastProvider.on(ON_ACCOUNT_USER_REMOVED).subscribe(value => {
      this._accountUserLogged = false;
      this._readyToRender = true;
    });
      // this._accountUserLogged = true;
      // this._readyToRender = true;
  }

  /**
   * Configura il locale a it settando il bundle ita di devextreme
   */
  protected configLocalization(): void {

  }

}
