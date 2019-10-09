import {DEFAULT_INTERRUPTSOURCES, Idle} from "@ng-idle/core";
import {Keepalive} from "@ng-idle/keepalive";
import {Router} from "@angular/router";
import {Injectable, EventEmitter} from "@angular/core";
import { NtJwtLoginService } from "./nt-jwt-login.service";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class SessionManager {
    public idleState = "Not started.";
    public timedOut = false;
    public lastPing?: Date = null;
    private idleSetted = false;
    // private myLastInterruptMillis: number;
    // private lastInterruptSent: number;
    constructor(private idle: Idle,
        private keepalive: Keepalive,
        private http: HttpClient,
        private loginService: NtJwtLoginService) {
    }

    public setExpireTokenOnIdle(idleSeconds: number, pingInterval: number, logoutRedirectRoute: string) {
        if (!this.idleSetted) {

            // window.addEventListener("storage", e => {
            //     console.log("Local storage listen GR7", e);
            //     for (let i = 0; i < 4; i++) {
            //         console.log(localStorage.key(i));
            //     }
                // let lastInterruptMillis: number;
                // const lastInterruptString: string = localStorage.getItem("lastInterrupt");
                // if (lastInterruptString && lastInterruptString !== "") {
                //     lastInterruptMillis = Number.parseInt(lastInterruptString);
                //     // const lastInterruptString: string = localStorage.getItem("lastInterrupt");
                //     // const nowMillis = new Date().getTime();
                //     if (!this.myLastInterruptMillis || (this.myLastInterruptMillis !== lastInterruptMillis)) {
                //         console.log("Wake up! Someone woke you up! GR7");
                //         this.reset();
                //         this.myLastInterruptMillis = lastInterruptMillis;
                //     }
                // }
            // });

            // sets an idle timeout of 5 seconds, for testing purposes.
            this.idle.setIdle(idleSeconds);
            // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
            this.idle.setTimeout(10);
            // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
            this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
            // this.idle.onInterrupt.subscribe(() => {
                // const nowMillis = new Date().getTime();
                // console.log("interrupt: ", nowMillis);
                // if (!this.lastInterruptSent || this.isTimePassed(nowMillis, this.lastInterruptSent, 10000)) {
                //     console.log("onInterrupet, 10 seconds pass, GR7");
                //     this.lastInterruptSent = nowMillis;
                //     localStorage.setItem("lastInterrupt", this.lastInterruptSent.toString());
                // }
            // });

            // idle.onIdleEnd.subscribe(() => this.idleState = 'No longer idle.');
            this.idle.onIdleEnd.subscribe(() => {
                // console.log("No longer Idle, GR7");
                // const nowMillis = new Date().getTime();
                // this.lastInterruptSent = nowMillis;
                // localStorage.setItem("lastInterrupt", this.lastInterruptSent.toString());
            });

            this.idle.onTimeout.subscribe(() => {
                // sessionStorage.removeItem("token");
                // sessionStorage.removeItem("userinfo");
                console.log("sessione scaduta!");
                this.idleState = "Timed out!";
                this.timedOut = true;
                this.loginService.logout(logoutRedirectRoute, true);
                this.idleSetted = false;


            });
            // idle.onIdleStart.subscribe(() => this.idleState = 'You\'ve gone idle!');
            // this.idle.onIdleStart.subscribe(() => console.log("You've gone idle!"));
            // idle.onTimeoutWarning.subscribe((countdown) => this.idleState = 'You will time out in ' + countdown + ' seconds!');
            // this.idle.onTimeoutWarning.subscribe((countdown: number) => console.log("You will time out in " + countdown + " seconds!") );

            if (pingInterval && pingInterval > 0 && window.location.hostname !== "localhost") {
                // sets the ping interval
                this.keepalive.interval(pingInterval);
                this.keepalive.onPing.subscribe(() => {
                    this.http.head(window.location.href).subscribe(
                    () => {
                        this.lastPing = new Date();
                        // console.log("ping: ", this.lastPing);
                    });
                });
            }

            this.reset();

            this.idleSetted = true;
        }
    }

    public get onTimeOutWarning(): EventEmitter<number> {
        return this.idle.onTimeoutWarning;
    }

    public get onIdleEnd(): EventEmitter<any> {
        return this.idle.onIdleEnd;
    }

    public get onIdleStart(): EventEmitter<any> {
        return this.idle.onIdleStart;
    }

    private isTimePassed(start: number, end: number, millis: number): boolean {
        return (end - start) >= millis;
    }

    public reset() {
        this.idle.watch();
        this.idleState = "Started.";
        this.timedOut = false;
    }
}
