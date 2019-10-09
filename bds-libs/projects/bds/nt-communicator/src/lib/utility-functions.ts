import { KrintHeaders } from "./definitions";


export class UtilityFunctions {


    public static cloneObj(c: any): any {
        const row = {};
        for (const prop in c) {
            row[prop] = c[prop];
        }
        return row;
    }

    public static transformDateFieds(obj: any, datepipe): any {
        const newObj = {};
        for (const prop in obj) {
            if (datepipe && obj[prop] instanceof Date) {
                newObj[prop] = datepipe.transform(obj[prop], "yyyy-MM-ddTHH:mm:ss");
            } else {
                newObj[prop] = obj[prop];
            }
        }
        return newObj;
    }


    // devo svuotare i campi oggetto (quelli che iniziano per id),
    // e mettere il valore aggiornato delle foreign key nei campi di tipo foreign key (quelli che iniziano per fk_)
    public static fixFkFieldsForUpdate(origObj: any, datepipe): any {

        if (typeof (origObj) != "object") {
            return origObj;
        }

        let newObj = {};

        let hasProp = false;

        for (const prop in origObj) {

            hasProp = true;

            if (datepipe && origObj[prop] instanceof Date) {
                newObj[prop] = datepipe.transform(origObj[prop], "yyyy-MM-ddTHH:mm:ss");
            } else if (typeof (origObj[prop]) == "object") {
                if (origObj[prop] instanceof Array) {
                    const origArray = origObj[prop];
                    const newArray: any[] = [];
                    origArray.forEach(element => {
                        newArray.push(this.fixFkFieldsForUpdate(element, datepipe));
                    });
                } else {
                    newObj[prop] = this.fixFkFieldsForUpdate(origObj[prop], datepipe);
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


    public static fixDateFields(obj) {
        const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;

        for (const prop in obj) {
            if (typeof obj[prop] === "string" && dateFormat.test(obj[prop])) {
                obj[prop] = new Date(obj[prop]);
            }
        }

    }

    public static callFunctionForArray(funct, array: any[]) {
        array.forEach(element => {
            funct(element);
        });
    }

    public static buildKrintHeaders(): any {
        const krintHeaders: KrintHeaders = {
            logga: true
        };
        const additionalHeaders = {
            "krint": window.btoa(JSON.stringify(krintHeaders))
        };
        return additionalHeaders;
    }

}
