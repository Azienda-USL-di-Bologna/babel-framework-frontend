import {Entity} from '@bds/nt-communicator';
import {Fornitore} from './Fornitore';

export class Prodotto implements Entity {
  public id: number;
  public descrizione: String;
  public fornitore: Fornitore;
}
