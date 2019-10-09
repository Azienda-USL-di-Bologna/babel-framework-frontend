import {NotificationMessage, NotificationMessageSeverity} from '@nfa/ref';
import {Message} from 'primeng/api';
import {DialogNotificationMessage} from './dialog-message-component/dialog-notification-message';

export class BaseMessageComponent {

  _DEFAULT_DISPLAY_TIME = 3000;

  protected convertMessage(notificationMessage: NotificationMessage, key: string, sticky: boolean = false): Message {
    const message: Message = {
      summary: notificationMessage.title ? notificationMessage.title : '',
      detail: notificationMessage.message,
      severity: this.calculateSeverity(notificationMessage.severity),
      life: notificationMessage.displayTime ? notificationMessage.displayTime : this._DEFAULT_DISPLAY_TIME,
      key: key,
      sticky: sticky
    };

    return message;
  }

  protected calculateSeverity(notificationMessageSeverity: NotificationMessageSeverity): string {
    switch (notificationMessageSeverity) {
      case NotificationMessageSeverity.INFO:
        return 'info';
      case NotificationMessageSeverity.SUCCESS:
        return 'success';
      case NotificationMessageSeverity.WARNING:
        return 'warn';
      case NotificationMessageSeverity.ERROR:
        return 'error';
    }
  }
}
