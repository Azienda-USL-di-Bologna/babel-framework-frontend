import { ExtractFromObject } from '../definitions/definitions';


export class UtilityFunctions {


    public static cloneObj(c: any): any {
        const row = {};
        for (const prop in c) {
            row[prop] = c[prop];
        }
        return row;
    }


    /**
     * Crea un oggetto in cui le proprietà sono state aggiustate per come se le aspetta il server, per poter essere usato in un Http Post o Patch
     * sostituisce la funzione fixFkFieldsForUpdate()
     * @param origObj oggetto origine
     * @param datepipe
     */
    public static cleanObjForHttpCall(origObj: any, datepipe): any {
        if (typeof (origObj) != "object") {
            return origObj;
        }
        let newObj = {};
        let hasProp: boolean = false;
        for (let prop in origObj) {
            hasProp = true;
            if (datepipe && origObj[prop] instanceof Date) {
                newObj[prop] = datepipe.transform(origObj[prop], "yyyy-MM-ddTHH:mm:ss");
            } else if (typeof (origObj[prop]) == "object") {
                if (origObj[prop] instanceof Array) {
                    let origArray = origObj[prop];
                    let newArray: any[] = [];
                    origArray.forEach(element => {
                        newArray.push(this.cleanObjForHttpCall(element, datepipe));
                    });
                    newObj[prop] = newArray;
                } else {
                    newObj[prop] = this.cleanObjForHttpCall(origObj[prop], datepipe);
                }
            } else {
                newObj[prop] = origObj[prop];
            }
        }
        if (!hasProp) {
            newObj = null;
        }
        return newObj;
    }

    public static cleanArrayForHttpCall(origArray: any[], datepipe): any[] {
        const newArray = [];
        origArray.forEach(element => {
            newArray.push(this.cleanObjForHttpCall(element, datepipe));
        });
        return newArray;
    }

    public static fixDateFields(obj) {
        const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;

        for (const prop in obj) {
            if (typeof obj[prop] === 'string' && dateFormat.test(obj[prop])) {
                obj[prop] = new Date(obj[prop]);
            }
        }

    }

    public static callFunctionForArray(funct, array: any[]) {
        array.forEach(element => {
            funct(element);
        });
    }




}

/**
 * Crea una funzione di tipo ExtractFromObject, navigando l'oggetto dato in pasto alla {@link ExtractFromObject}
 * @param dottedNavigationString una stringa del tipo dominio.descrizione
 *        che vuol dire estrai la proprietà descrizione della proprietà dominio dell'object
 *        dato come parametro della {@link ExtractFromObject}
 * @param notFoundValue il valore di default da dare se la proprietà non esiste, default {@literally undefinded}
 */
export function extractValueDotAnnotation(dottedNavigationString: string, notFoundValue?: string): ExtractFromObject {
    return (object: any) => {
        if (!notFoundValue) {
            notFoundValue = undefined;
        }
        const dotSplit = dottedNavigationString.split('.');
        const result = dotSplit.reduce((previousValue, currentValue) => {
            /*
                (previousValue[currentValue] || previousValue[currentValue] === 0)
                perchè senò lo zero viene visto come false
             */
            if (typeof previousValue === 'object' && (previousValue[currentValue] || previousValue[currentValue] === false
                || previousValue[currentValue] === 0)) {
                return previousValue[currentValue];
            } else {
                return notFoundValue;
            }
        }, object);
        return result;
    };
}

/**
 * Funzione di utilità per ottenere l'estrazione dal {@param sourceObject} in base
 * al {@param extractFunct} che può essere una stringa è quindi interpretata attraverso {@link extractValueDotAnnotation}
 * oppure una funzione di tipo {@link ExtractFromObject}
 * @param extractFunct
 * @param sourceObject
 * @return l'estrazione dal sourceObjectin base al extractFunct
 */
export function extractValueFromDotAnnotationOrFunction(extractFunct: string | ExtractFromObject, sourceObject: object): Object {
    if (typeof extractFunct === 'function') {
        return extractFunct(sourceObject);
    }
    if (typeof extractFunct === 'string') {
        return extractValueDotAnnotation(extractFunct)(sourceObject);
    }
}