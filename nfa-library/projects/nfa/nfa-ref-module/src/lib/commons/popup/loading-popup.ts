import {Subscription} from 'rxjs';

export interface LoadingPopup {
  subscription: Subscription;
  message: string;
  timeout?: number;
}
