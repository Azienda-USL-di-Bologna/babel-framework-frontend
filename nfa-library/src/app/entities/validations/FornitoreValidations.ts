import {ValidationErrorsNextSDR} from '@nfa/next-sdr';

export class FornitoreValidations{
  public static validate(fornitore:any):ValidationErrorsNextSDR[]{
    const errors:ValidationErrorsNextSDR[] = [];

    if (!fornitore.descrizione){
      errors.push({message:"É necessario specificare una descrizione per il fornitore.",
        validationSeverity:'ERROR',isBlocking:true,fieldName:'descrizione'});
      return errors;
    }

    return errors;
  }
}
