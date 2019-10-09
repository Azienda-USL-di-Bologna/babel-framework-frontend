import {Component, OnInit} from '@angular/core';
import {MessageService} from 'primeng/api';
import {BroadcastProvider} from '@nfa/core';
import {NotificationMessage, ON_SEND_TOAST_NOTIFICATION_MESSAGE} from '@nfa/ref';
import {BaseMessageComponent} from '../base-message-component';


@Component({
  selector: 'app-toast-message-component',
  templateUrl: './toast-message-component.html',
  // styleUrls: ['./dettaglio-provvedimento.component.css']
})
export class ToastMessageComponent extends BaseMessageComponent implements OnInit {

  _KEY_TOASTS_MESSAGE_STANDARD = 'KEY_TOASTS_MESSAGE_STANDARD';

  constructor(protected _messageService: MessageService, protected _broadcastProvider: BroadcastProvider) {
    super();
    this.registerSendToastNotificationMessageEvent();
  }

  ngOnInit(): void {

  }

  protected registerSendToastNotificationMessageEvent(): void {
    this._broadcastProvider.on(ON_SEND_TOAST_NOTIFICATION_MESSAGE).subscribe((notificationMessage: NotificationMessage) => {
      this._messageService.add(this.convertMessage(notificationMessage,this._KEY_TOASTS_MESSAGE_STANDARD));
    });
  }
}


