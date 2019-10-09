import {Entity} from '@bds/nt-communicator';

export class Utente implements Entity {
  public id?: number;
  public username: String;
  public password: String;
  public email: String;
  public nome: String;
  public cognome: String;
  public enabled: boolean;
  public notificheAttive: boolean;

  public clone(): Utente {
    const utente: Utente = new Utente();
    const currUtente: Utente = this;
    for (const prop in currUtente){
      utente[prop] = currUtente[prop];
    }
    return utente;
  }
}
