// =================== VALIDAZIONI =========================

import {extractValueDotAnnotation} from '../utils/utility-functions';

/**
 * Classe per la gestione delle validazioni sulle entità
 */
export class EntityValidations {
    public fieldValidators: FieldValidatorsNextSDR[];
    public validateEntity: (entity: any) => ValidationErrorsNextSDR[];


    /**
     *
     * @param fieldValidators array di validatori di tipo {@link FieldValidatorsNextSDR}
     * @param validateEntity funzione per la validazione dell'entità
     */
    constructor(fieldValidators?: FieldValidatorsNextSDR[], validateEntity?: (entity: any) => ValidationErrorsNextSDR[]) {
        this.fieldValidators = fieldValidators;
        this.validateEntity = validateEntity;
    }

    /**
     * Metodo per avviare le validazioni su una entità, ritorna l'array di {@link ValidationErrorsNextSDR} che sono stati restituiti dai
     * {@link FieldValidatorsNextSDR} o dalla funzione di validazione passate al costruttore
     * @param entity l'entità su cui avviare le validazioni
     */
    public validate(entity: any): ValidationErrorsNextSDR[] {
        const result: ValidationErrorsNextSDR[] = [];
        if (this.fieldValidators) {
            this.fieldValidators.forEach((fieldValidator: FieldValidatorsNextSDR) => {
                // const fieldValue = entity[fieldValidator.field];
                const fieldValue = extractValueDotAnnotation(fieldValidator.field, null)(entity);
                fieldValidator.validators.forEach((validator: ValidatorsNextSDR) => {
                    const validatorError: ValidationErrorsNextSDR = validator.validate(fieldValue);
                    if (validatorError) {
                        validatorError.fieldName = fieldValidator.fieldName ? fieldValidator.fieldName : fieldValidator.field;
                        result.push(validatorError);
                    }
                });
            });
        }
        if (this.validateEntity) {
            const entityValidationsErrors: ValidationErrorsNextSDR[] = this.validateEntity(entity);
            if (entityValidationsErrors) {
                result.push(...entityValidationsErrors);
            }
        }
        return result;
    }
}

/**
 * Validatori da applicare a un singolo campo dell'entità
 */
export interface FieldValidatorsNextSDR {
    /**
     * Il nome del campo dell'entità su cui avviare le validazioni
     */
    field: string  ;
    /**
     * L'array di validatory da applicare al campo
     */
    validators: ValidatorsNextSDR[];
    /**
     * Il nome visuale del campo su cui si applicano le validazioni, utile per visualizzare messaggi di errore per l'UI
     */
    fieldName?: string;
}

/**
 * Interfaccia dei validatori
 */
export interface  ValidatorsNextSDR {
    /**
     * La funzione prende il valore del campo e applica una validazione, tornando un {@link ValidationErrorsNextSDR} se c'è un errore,
     * null altrimenti
     * @param fieldValue
     */
    validate(fieldValue: any): ValidationErrorsNextSDR | null;
}

/**
 * L'interfaccia degli errori di validazione
 */
export interface ValidationErrorsNextSDR {
    /**
     * Messaggio di errore da mostrare nel caso ci sia un errore di validazione
     */
    message: string;
    /**
     * La severità dell'errore
     */
    validationSeverity: ValidationSeverity;
    /**
     * Se l'errore è bloccante o meno, NON ANCORA USATO
     */
    isBlocking: boolean;
    /**
     * Eventuale nome del campo su cui mostrare l'errore
     */
    fieldName?: string;
};

/**
 * La severity di un errore di validazione
 */
export type ValidationSeverity = 'WARNING' | 'ERROR';

// ============== DEFAULT VALIDATOR =================

/**
 * Classe che contiene una serie di validatori preconfezionati
 */
export class ValidatorsDefinded {

    /**
     * Validatore per la gestione dei campi obbligatori, va in errore se il campo è vuoto
     * @param errorMessage il messaggio di errore da visualizzare, opzionale
     * @param validationSeverity la severità dell'errore, opzionale default {@link ValidationSeverity#ERROR}
     */
    static required(errorMessage?: string, validationSeverity?: ValidationSeverity): ValidatorsNextSDR {
        validationSeverity = validationSeverity ? validationSeverity : 'ERROR';
        return {
            validate: (field) => {
                if (field || field === false || field === 0) {
                    return null;
                }
                const error: ValidationErrorsNextSDR = {
                    message: errorMessage ? errorMessage : 'Il campo è obbligatorio',
                    validationSeverity: validationSeverity,
                    isBlocking: validationSeverity === 'ERROR',
                };
                return error;
            }
        };
    }

    /**
     * Validatore per la lunghezza di un campo stringa
     * @param length la lunghezza minima del campo
     * @param errorMessage il messaggio di errore da visualizzare, opzionale
     * @param validationSeverity la severità dell'errore, opzionale default {@link ValidationSeverity#ERROR}
     */
    static minLength(length: number, errorMessage?: string, validationSeverity?: ValidationSeverity): ValidatorsNextSDR {
        validationSeverity = validationSeverity ? validationSeverity : 'ERROR';
        return {
            validate: (field) => {
                if (!field || typeof field !== 'string' || (typeof field === 'string' && field.length >= length)) {
                    return null;
                }
                const error: ValidationErrorsNextSDR = {
                    message: errorMessage ? errorMessage : 'Il campo deve avere una lunghezza minima di ' + length,
                    validationSeverity: validationSeverity,
                    isBlocking: validationSeverity === 'ERROR',
                };
                return error;
            }
        };
    }

    /**
     * Validatore per la lunghezza massima di un campo
     * @param length la lunghezza massima del campo
     * @param errorMessage il messaggio di errore da visualizzare, opzionale
     * @param validationSeverity la severità dell'errore, opzionale default {@link ValidationSeverity#ERROR}
     */
    static maxLength(length: number, errorMessage?: string, validationSeverity?: ValidationSeverity): ValidatorsNextSDR {
        validationSeverity = validationSeverity ? validationSeverity : 'ERROR';
        return {
            validate: (field) => {
                if (!field || typeof field !== 'string' || (typeof field === 'string' && field.length <= length)) {
                    return null;
                }
                const error: ValidationErrorsNextSDR = {
                    message: errorMessage ? errorMessage : 'Il campo deve avere una lunghezza massima di ' + length,
                    validationSeverity: validationSeverity,
                    isBlocking: validationSeverity === 'ERROR',
                };
                return error;
            }
        };
    }

    /**
     * Validatore per la lunghezza esatta
     * @param length la lunghezza esatta del campo
     * @param errorMessage il messaggio di errore da visualizzare, opzionale
     * @param validationSeverity la severità dell'errore, opzionale default {@link ValidationSeverity#ERROR}
     */
    static exactLength(length: number, errorMessage?: string, validationSeverity?: ValidationSeverity): ValidatorsNextSDR {
        validationSeverity = validationSeverity ? validationSeverity : 'ERROR';
        return {
            validate: (field) => {
                if (!field || typeof field !== 'string' || (typeof field === 'string' && field.length == length)) {
                    return null;
                }
                const error: ValidationErrorsNextSDR = {
                    message: errorMessage ? errorMessage : 'Il campo deve avere una lunghezza di ' + length,
                    validationSeverity: validationSeverity,
                    isBlocking: validationSeverity === 'ERROR',
                };
                return error;
            }
        };
    }

    /**
     * Validatore per pattern
     * @param pattern il pattern da usare per la validazione
     * @param errorMessage il messaggio di errore da visualizzare, opzionale
     * @param ignoreCase se il match deve ignorare il case, opzionale default {@literal true}
     * @param validationSeverity la severità dell'errore, opzionale default {@link ValidationSeverity#ERROR}
     */
    static pattern(pattern: string, errorMessage?: string, ignoreCase?: boolean,
                   validationSeverity?: ValidationSeverity): ValidatorsNextSDR {
        validationSeverity = validationSeverity ? validationSeverity : 'ERROR';
        const regexp = new RegExp(pattern, (ignoreCase === undefined || ignoreCase === null || ignoreCase) ? 'i' : null );
        return {
            validate: (field) => {
                if (field && typeof field === 'string' && regexp.test(field)) {
                    return null;
                }
                const error: ValidationErrorsNextSDR = {
                    message: errorMessage ? errorMessage : 'Il campo deve rispettare il pattern ' + pattern,
                    validationSeverity: validationSeverity,
                    isBlocking: validationSeverity === 'ERROR',
                };
                return error;
            }
        };
    }

    /**
     * Validatore per email
     * @param errorMessage il messaggio di errore da visualizzare, opzionale
     * @param validationSeverity la severità dell'errore, opzionale default {@link ValidationSeverity#ERROR}
     */
    static email(errorMessage?: string, validationSeverity?: ValidationSeverity): ValidatorsNextSDR {
        // tslint:disable-next-line:max-line-length
        const emailRegex = '^[a-z][a-z0-9_\.\-]*@[a-z0-9\.\-]+\.[a-z]{2,4}$';
        return this.pattern(emailRegex,
            errorMessage ? errorMessage : 'La mail non è in un formato valido', true, validationSeverity);
    }

    /**
     * Validatore per codice fiscale italiano
     * @param errorMessage il messaggio di errore da visualizzare, opzionale
     * @param ignoreCase se il match deve ignorare il case, opzionale default {@literal true}
     * @param validationSeverity la severità dell'errore, opzionale default {@link ValidationSeverity#ERROR}
     */
    static codiceFiscale(errorMessage?: string, validationSeverity?: ValidationSeverity): ValidatorsNextSDR {
        // tslint:disable-next-line:max-line-length
        const cfRegex = '^[A-Z]{6}[0-9]{2}[A-EHLMPR-T][0-9]{2}[A-MZ][0-9]{3}[A-Z]$';
        return this.pattern(cfRegex,
            errorMessage ? errorMessage : 'Il Codice Fiscale non è in un formato valido', true, validationSeverity);
    }

}
