import {NextSDREntityProvider} from '../providers/next-sdr-entity-provider';
import {FiltersAndSorts, PagingConf, PagingPageConf} from './filter-sort-definitions';

export interface NextSdrEntity {
};

export class ForeignKey {
  id: number;
  targetEntity: string;
  url: string;
};

export type NextSdrProjection = {
  [key: string]: string;
};

export interface NextSdrEntityConfiguration {
  path: string;
  standardProjections: NextSdrProjection;
  customProjections: NextSdrProjection;
  collectionResourceRel: string;
  keyName: string;
};

export type EntitiesConfiguration = {
  [key: string]: NextSdrEntityConfiguration;
};

export class BatchOperation {
  operation: BatchOperationTypes;
  id: any;
  entityPath: string;
  entityBody: NextSdrEntity;
  additionalData: any;
  returnProjection: string;
}

export enum BatchOperationTypes {
  INSERT = "INSERT",
  UPDATE = "UPDATE",
  DELETE = "DELETE"
}

/**
 * La risposta di SpringDate Rest
 */
export interface RestPagedResult {
  page: RestPage;
  results: any[];
}

/**
 * Le informazioni di paginazione di spring data rest
 */
export interface RestPage {
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

/**
 * Funzione generica per estrarre una stringa da un oggetto
 */
export type ExtractFromObject = (object: any) => string;


/**
 * L'interfaccia delle colonne di una ptable
 */
export interface PTableColumn {
  /**
   * Il tipo del campo
   */
  fieldType: FieldTypeColumn | any;
  /**
   * Il nome del campo dell'entità o una funzione che estratta il valore da visualizzare dall'entità
   */
  field?: string | ExtractFromObject;
  /**
   * Il titolo della colonna della tabella
   */
  header?: string;
  // ================== RICERCA ==========================
  /**
   * Indica se si possono fare ricerche su quel campo,
   * DEFAULT a {@literal true}
   */
  searchable?: boolean;
  /**
   * Permette di specificare il campo di ricerca nel caso in cui questo sia diverso da field, o che field sia di tipo funzione
   */
  searchField?: string;
  /**
   * Il tipo di filtraggio da utilizzare, vedi {@link FILTER_TYPES}
   */
  filterMatchMode?: string;

  // per field Type button
  /**
   * Label, ha senso solo per fieldType button
   */
  label?: string;
  /**
   * Icona, ha senso solo per fieldType button
   */
  icon?: string;
  /**
   * Eventuale formato con cui verrà visualizzato il campo, per ora valido solo per i campi di tipo Date o DateTime
   */
  format?: PTableDateFormat | any;
  /**
   * Stile della colonna es. width, textAlign..
   */
  style?: any;
  /**
   * funzione che viene richiamata al click, ha senso solo per fieldType button
   * @param object l'entità
   */
  onClick?: (object: any) => void;
  /**
   * Per usare i servizi di decodifica, vedi {@link DecodeService}
   */
  decode?: DecodeService | any;
}

/**
 * Interfaccia per la definizione dei formati dei filed di tipo Date o DateTime
 */
export interface PTableDateFormat {
  /**
   * Formato utilizzato per la visualizzazione (quello previsto dal DatePipe di Angular)
   */
  viewFormat: string;
  /**
   * Formato utilizzato per il calendario in ricerca (quello previsto dal componente p-calendar di PrimeNG)
   */
  calendarFormat: string;
}

/**
 * Interfaccia che descrive un servizio per la decodifica di valori,
 * da usare con enum, o anche per risolvere entità partendo dall'id o da altre proprietà
 *
 * Es. Enum
 * {
        field: 'utenteRole',
        header: 'Ruolo',
        filterMatchMode: FILTER_TYPES.not_string.equals,
        fieldType: 'enum',
        decode: {
          decodeValues: [
            {key: 'ROLE_ADMIN', value: 'Amministratore'},
            {key: 'ROLE_ADMIN_DOMINIO', value: 'Amministratore Dominio'},
            {key: 'ROLE_USER', value: 'Utente'},
          ]
        }
   }
 *
 * Es. decodifica campo
 *
 *  {
            field: 'dominio.id', => perchè la key di dominioValues è l'id
            header: 'Dominio',
            filterMatchMode: FILTER_TYPES.not_string.equals,
            fieldType: 'object',
            decode: {
              decodeValues: dominioValues, =>  key idDominio, value dominio
              decodeField: 'descrizione', => il campo da visualizzare
              searchField: 'dominio.id', => il campo dell'oggetto con cui fare il match
             // forShow: false | true, => se si vuole utilizzare anche come decodifica
            }
    }
 */
export interface DecodeService {

  /**
   * L'array con i valori per fare la decodifica
   */
  decodeValues: { key: object, value: object }[] | any[];
  /**
   * Il campo per decidere quale campo del decodeValues[key] deve essere visualizzato. Da utilizzare se decodeValues[key] è un object
   * Se non popolato verrà utilizzato l'intero campo decodeValues[key]. Si parte dal decodeValues[key].
   * nel caso di string accetta dottedAnnotation es. utente.nome
   */
  decodeField?: string | ExtractFromObject;
  /**
   * Il campo su cui viene fatta la ricerca, il valore della ricerca è sempre rappresentato dalla decodeValues[key].
   * Si parte dall'entità della tabella, quindi se abbiamo un utente che ha una proprietà dominio
   * e noi vogliamo cercare per l'id del dominio scriveremo qui dominio.id.
   * Nel caso in cui si decodifica un enum non è necessario specificare questa proprietà.
   *
   */
  searchField?: string;
  /**
   * Se vogliamo utilizzare queste informazioni per il componente di ricerca {@link NextSdrEditPrimengTableColumnSearchComponent}
   * Farà comparire una dropdown con i decodeValues[key][decodeField] come opzioni di ricerca.
   * DEFAULT {@literal true}
   */
  forSearch?: boolean;
  /**
   * Se vogliamo utilizzare queste informazioni per il componente {@link NextSdrEditPrimengTableColumnBodyComponent},
   * utilizzerà le decodeValues per decodificare in visualizzazione un campo
   * DEFAULT {@literal true}
   */
  forShow?: boolean;
}

/**
 * Tipo che definisce i tipi di dati di un'entità
 */
export type FieldTypeColumn = 'string' | 'boolean' | 'number' | 'Date' | 'DateTime' | 'object' | 'button' | 'fileMedia' ;

/**
 * Interfaccia di supporto per ogetti che lavorano con {@link NextSDREntityProvider}
 */
export interface NextSdrServiceQueringWrapper {
  /**
   * Il servizio su cui querare
   */
  service: NextSDREntityProvider;
  /**
   * la projection da utilizzare
   */
  projection?: string;
  /**
   * i filtri di base da utilizzare
   */
  initialFiltersAndSorts?: FiltersAndSorts;
  /**
   * le configurazioni di filtraggio
   */
  lazyEventFiltersAndSorts?: FiltersAndSorts;
  /**
   * le configurazioni di paginazione
   */
  pageConf?: PagingConf;
}

/**
 * Un tipo per definire la modalità di operatività su un'entità
 */
export type Mode = 'GET' | 'INSERT' | 'UPDATE' | 'DELETE';

