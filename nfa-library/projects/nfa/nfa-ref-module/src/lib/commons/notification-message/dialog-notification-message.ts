import {NotificationMessage} from './notification-message';

export interface DialogNotificationMessage extends NotificationMessage {
    buttons: Array<DialogButton>;
}

/**
 * Identifica un bottone della dialog
 */
export interface DialogButton {
    caption: string;
    type: DialogButtonType;
    callback?: () => void;
}

/**
 * Definisce lo stile del pulsante
 */
export type DialogButtonType = 'PRIMARY' | 'SECONDARY' | 'SUCCESS';
