import { Injectable, NgZone } from "@angular/core";
import { IntimusClientService, IntimusCommand, IntimusCommands, ShowMessageParams} from "@bds/nt-communicator";
import { Subscription, Observable } from "rxjs";
import { UtenteUtilities, NtJwtLoginService } from "@bds/nt-jwt-login";
import { DialogService, DynamicDialogRef } from "primeng/api";
import { PopupMessaggiComponent } from "./popup-messaggi.component";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { getInternautaUrl, BaseUrlType } from "@bds/ng-internauta-model";
import { Idle, SimpleExpiry } from "@ng-idle/core";

export const MessaggeroSettings: any = {
  messaggero: {
      seen: "messaggero.seen"
  }
};

export interface IdleObject {
  idle: Idle;
  subscriptions: Subscription[]
}

@Injectable({
  providedIn: 'root'
})
export class PopupMessaggiService {

  private subscriptions: Subscription[] = [];
  private intimusSubscribbed = false;
  private dyalogInstance: DynamicDialogRef = null;
  public messages: ShowMessageParams[] = [];
  public messagesIndex = -1;
  public utenteUtilities: UtenteUtilities;
  private messageIdles: IdleObject[] = [];

  constructor(private intimusClientService: IntimusClientService, 
    private loginService: NtJwtLoginService,
    public dialogService: DialogService, 
    private httpClient: HttpClient) { 
      // si sottoscrive a intimus una volta che l'utente è connesso
      this.subscriptions.push(this.loginService.loggedUser$.subscribe((u: UtenteUtilities) => {
        if (u) {
          this.utenteUtilities = u;
          // siccome siamo al login, se ci sono messaggi da mostrare li mostra
          this.showUnSeenMessage();
          if (!this.intimusSubscribbed) {
            this.subscriptions.push(this.intimusClientService.command$.subscribe((command: IntimusCommand) => {
              if (command.command === IntimusCommands.ShowMessage) {
                this.popupMessage(command.params as ShowMessageParams);
              }
            }));
            this.intimusSubscribbed = true;
          }
        }
      }));
  }

  private showUnSeenMessage() {
    const url: string = getInternautaUrl(BaseUrlType.Messaggero) + "/custom/getMessaggiDaMostrare";
    
    return this.httpClient.get(url).subscribe( (res: ShowMessageParams[]) => {
      res.forEach((message: ShowMessageParams) => this.popupMessage(message));
      
    });
    
  }

  private popupMessage(params: ShowMessageParams) {
    const index: number = this.messages.findIndex(m => m.messageId === params.messageId);
    if (index >= 0 ) {
      this.messages.splice(index, 1);
    }
    this.messages.push(params);
    this.messagesIndex = this.messages.length - 1;
    if (!this.dyalogInstance) {
    this.dyalogInstance = this.dialogService.open(PopupMessaggiComponent, {
      data: params, 
      header: params.title,
      width: "20%",
      showHeader: false
    });
    }
  }

  public processMessage(notShowAnymoreClicked: boolean) {
    const selectedMessage: ShowMessageParams = this.getSelectedMessage();
    if (notShowAnymoreClicked || selectedMessage.type === "MOSTRA_UNA_SOLA_VOLTA") {
      this.setCurrentMessageSeen().subscribe(() => {
        if (this.messageIdles[selectedMessage.messageId]) {
          this.resetIdleObj(this.messageIdles[selectedMessage.messageId]);
        }
        this.deleteAndCloseIfLast();
      });
    } else if (selectedMessage.invasivity === "POPUP" && selectedMessage.type == "CONSENTI_SCELTA") {
      this.reschedule();
      this.deleteAndCloseIfLast();
    } else {
      if (this.messageIdles[selectedMessage.messageId]) {
        this.resetIdleObj(this.messageIdles[selectedMessage.messageId]);
      }
      this.deleteAndCloseIfLast();
    }
  }

  public setCurrentMessageSeen(): Observable<any> {
    const url: string = getInternautaUrl(BaseUrlType.Messaggero) + "/custom/setMessaggiVisti";
    const options = {
        headers: new HttpHeaders({"Content-Type": "application/json"})
    };
    return this.httpClient.post(url, [this.getSelectedMessage().messageId], options);
  }

  public reschedule() {
    const selectedMessage = this.getSelectedMessage();

    if (!this.messageIdles[selectedMessage.messageId]) {
      this.messageIdles[selectedMessage.messageId] = {
        idle: new Idle(new SimpleExpiry(), new NgZone({enableLongStackTrace: false})),
        subscriptions: []
      }
    }
    const idleObj: IdleObject = this.messageIdles[selectedMessage.messageId];
    this.resetIdleObj(idleObj);
    idleObj.idle.setIdle(selectedMessage.rescheduleInterval);
    idleObj.idle.setInterrupts([]);
    idleObj.subscriptions.push(idleObj.idle.onIdleStart.subscribe(() => {
      this.popupMessage(selectedMessage);
    }));
    idleObj.idle.watch();
  }

  private resetIdleObj(idleObj: IdleObject) {
    if (idleObj.subscriptions && idleObj.subscriptions.length > 0) {
      while (idleObj.subscriptions.length > 0) {
        idleObj.subscriptions.pop().unsubscribe();
      }
    }
    if (idleObj.idle) {
      idleObj.idle.stop();
    }
  }

  public deleteAndCloseIfLast() {
    this.messages.splice(this.messagesIndex, 1);
    if (this.messages.length == 0) {      
      this.messagesIndex = -1;
      // this.dyalogInstance.close();
      this.dialogService.dialogComponentRef.instance.close();
      this.dyalogInstance = null;
    } else if (this.messagesIndex == this.messages.length) {
      this.messagesIndex --;
    }
  }

  public getSelectedMessage(): ShowMessageParams {
    return this.messages[this.messagesIndex];
  }
}
