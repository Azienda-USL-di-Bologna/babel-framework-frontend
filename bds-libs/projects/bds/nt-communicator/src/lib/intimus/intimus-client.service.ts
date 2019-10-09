import { Injectable } from "@angular/core";
import * as Primus from "src/assets/primus.js";
import { Subject, Observable } from "rxjs";
import { IntimusCommand } from "./intimus-command";
import * as Bowser from "bowser";

@Injectable({
  providedIn: "root"
})
export class IntimusClientService  {

  private initialized = false;
  private _command$: Subject<IntimusCommand> = new Subject();

  constructor() {
  }

  public start(intimusUrl: string, application: string, idPersona: number, idAzienda: number) {
    if (!this.initialized && idPersona && idAzienda) {
      this.initializeIntimus(intimusUrl, application, idPersona, idAzienda);
      this.initialized = true;
    }
  }

  private initializeIntimus(intimusUrl: string, application: string, idPersona: number, idAzienda: number) {
    // const primusUrl = getInternautaUrl(BaseUrlType.Intimus);
    const primus = Primus.connect(intimusUrl, {
      reconnect: {
        maxDelay: 10000 // Number: The max delay for a reconnect retry.
        , minDelay: 500 // Number: The minimum delay before we reconnect.
        , retries: Infinity // Number: How many times should we attempt to reconnect.
      }
    });

    primus.on("data", data => {
      console.log("**********Received a new message from the server*************", data);
      if (data.command === "registerClient") {
        // console.log("Received a new message from the server", data);
        this.registerClient(primus, application, idPersona, idAzienda);
      } else if (data && data.command) {
        const cmd = data.command + "&params=" + JSON.stringify(data.params);
        const intimusCommand: IntimusCommand = new IntimusCommand(data.command, data.params);
        this.pushCommand(intimusCommand);
         // console.log("Received command from the server", cmd);
      } else {
        // console.log(JSON.stringify(data));
      }
    });

    primus.on("open", () => {
      this.registerClient(primus, application, idPersona, idAzienda);
    });
  }

  private registerClient(primus: Primus, application: string, idPersona: number, idAzienda: number) {
    const clientInfo = {
      command: "registerClient",
      params: {
        user: idPersona,
        id_azienda: idAzienda,
        application: application,
        browserinfo: Bowser.getParser(window.navigator.userAgent),
        ip: null,
        resolution: this.getScreenResolution()
      }
    };
    primus.write(clientInfo);
  }

  private getScreenResolution() {
    if (Math.abs(window.orientation as number) - 90 === 0) {
      return screen.height + "x" + screen.width;
    } else {
      return screen.width + "x" + screen.height;
    }
  }

  private pushCommand(intimusCommand: IntimusCommand) {
    this._command$.next(intimusCommand);
  }

  public get command$(): Observable<IntimusCommand> {
    return this._command$.asObservable();
  }
}
