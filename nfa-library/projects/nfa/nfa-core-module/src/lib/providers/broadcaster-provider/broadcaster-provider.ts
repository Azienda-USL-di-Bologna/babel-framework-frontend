/**
 * Provider che fornisce dei metodi per spedire messaggi tra diversi componenti.
 * Un componente destinatario può registrarsi a con l'apposito metodo per ricevere un BroadcastEvent.
 * Un componente mittente può inviare un BroadcastEvent a tutti i componenti destinatari che si sono registrati su di esso.
 *
 */

import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {Observable} from 'rxjs';
import { filter } from 'rxjs/operators';
import { map } from 'rxjs/operators';


/**
 * Oggetto che contiene i messaggi/eventi identificati da una chiave e da eventuali parametri/dati
 */
interface BroadcastEvent {
    key: any;
    data?: any;
}

@Injectable()
export class BroadcastProvider {

    private _eventBus: Subject<BroadcastEvent>;

    constructor() {
        this._eventBus = new Subject<BroadcastEvent>();
    }

    // Metodo da utilizzare per generare un evento e quindi inviare un BroadcastEvent a tutti i componenti che si sono registrati su di esso
    public broadcast(key: any, data?: any) {
        this._eventBus.next({key, data});
    }

    // Metodo per registrarsi ad un evento (identificato dalla chiave)
    public on<T>(key: any): Observable<T> {
        return this._eventBus.asObservable()
            .pipe(
                filter((event) => event.key === key),
                map((event) => event.data));
    }

}
