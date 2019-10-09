import {NotificationMessage} from '@nfa/ref';

export const ON_SEND_DIALOG_NOTIFICATION_MESSAGE = "send_dialog_notification_message";
export const ON_CHECK_BEFORE_SAVE = "on_check_before_save";


export interface DialogNotificationMessage extends NotificationMessage {
    buttons: Array<DialogButton>;
}

/**
 * Identifica un bottone della dialog
 */
export interface DialogButton {
    caption?: string;
    icon?: string;
    type: DialogButtonType;
    callback?: () => void;
}

/**
 * Definisce lo stile del pulsante
 */
export type DialogButtonType = 'PRIMARY' | 'SECONDARY' | 'SUCCESS';
