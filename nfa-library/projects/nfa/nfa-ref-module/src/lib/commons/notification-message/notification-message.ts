
export interface NotificationMessage {
  title?: string;
  message: string;
  displayTime?: number;
  severity: NotificationMessageSeverity;
}

export enum NotificationMessageSeverity {
  INFO,
  WARNING,
  ERROR,
  SUCCESS,
}


