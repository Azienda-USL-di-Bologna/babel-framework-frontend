import { Component, OnInit, OnDestroy } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/api';
import { ShowMessageParams } from '@bds/nt-communicator';
import { PopupMessaggiService } from './popup-messaggi.service';

@Component({
  selector: 'lib-popup-messaggi',
  templateUrl: './popup-messaggi.component.html',
  styleUrls: ['./popup-messaggi.component.scss']
})
export class PopupMessaggiComponent implements OnInit, OnDestroy {

  constructor(private config: DynamicDialogConfig, public popupMessaggiService: PopupMessaggiService) { }

  ngOnInit() {
    console.log(this.config);
    const params: ShowMessageParams = this.config.data;
    //this.messageText = params.body;
  }

  public scrollMessage(direction: string) {
    if (this.popupMessaggiService.messages.length > 1) {
      let index = this.popupMessaggiService.messagesIndex;
      switch (direction) {
        case 'left':
            index --;
          if (index == -1) {
            index = this.popupMessaggiService.messages.length -1;
          }
          break;
        case 'right':
            index ++;
            if (index === this.popupMessaggiService.messages.length) {
              index = 0;
            }
          break;
      }
      this.popupMessaggiService.messagesIndex = index;
    }
  }

  /**
   * torna true se il messaggio deve avere il pulstante "non mostrare più attivo"
   */
  public isNotShowAnymorActive() {
    const selectedMessage: ShowMessageParams = this.popupMessaggiService.getSelectedMessage();
    return selectedMessage.type === "CONSENTI_SCELTA";
  }

  public ok() {
    console.log("ok");
    this.popupMessaggiService.processMessage(false);
  }

  public notShowAnymore() {
    console.log("notShowAnymore");
    this.popupMessaggiService.processMessage(true);
  }

  ngOnDestroy() {
    console.log("onDestroy");
    // this.popupMessaggiService.reset();
  }
}
