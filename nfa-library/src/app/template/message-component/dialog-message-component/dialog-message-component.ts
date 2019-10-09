import {Component, OnInit} from '@angular/core';
import {MessageService} from 'primeng/api';
import {BroadcastProvider} from '@nfa/core';
import {NotificationMessage, ON_SEND_TOAST_NOTIFICATION_MESSAGE} from '@nfa/ref';
import {BaseMessageComponent} from '../base-message-component';
import {DialogButton, ON_SEND_DIALOG_NOTIFICATION_MESSAGE, DialogNotificationMessage} from '@nfa/ref';


@Component({
  selector: 'app-dialog-message-component',
  templateUrl: './dialog-message-component.html',
  // styleUrls: ['./dettaglio-provvedimento.component.css']
})
export class DialogMessageComponent extends BaseMessageComponent implements OnInit {

  _KEY_TOASTS_MESSAGE_DIALOG = 'KEY_TOASTS_MESSAGE_DIALOG';
  protected _buttons: Array<DialogButton>;
  protected _buttonsNumber: number;
  protected _buttonCallback: (buttonId: string) => void;

  constructor(protected _messageService: MessageService, protected _broadcastProvider: BroadcastProvider) {
    super();
    this.registerSendDialogNotificationMessageEvent();
  }

  ngOnInit(): void {

  }

  protected registerSendDialogNotificationMessageEvent(): void {
    this._broadcastProvider.on(ON_SEND_DIALOG_NOTIFICATION_MESSAGE).subscribe((notificationMessage: DialogNotificationMessage) => {
      this._buttons = notificationMessage.buttons;
      this._buttonsNumber = this._buttons.length;
      this._messageService.add(this.convertMessage(notificationMessage, this._KEY_TOASTS_MESSAGE_DIALOG,true));
    });
  }

  buttonClick(button: any | DialogButton) {
   this._messageService.clear(this._KEY_TOASTS_MESSAGE_DIALOG);
    if (button.callback) {
        button.callback();
    }

  }
}


