export class Permesso {
    predicato: string;
    propaga_soggetto: boolean;
    propaga_oggetto: boolean;
    virtuale: boolean;
    data_inserimento_riga: Date;
    data_ultima_modifica: Date;
    origine_permesso: string;
    id_permesso_bloccato: number;
    attivo_dal: Date;
    attivo_al: Date;
}
