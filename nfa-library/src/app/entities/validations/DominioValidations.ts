import {ValidationErrorsNextSDR} from '@nfa/next-sdr';

export class DominioValidations{
  public static validate(dominio:any):ValidationErrorsNextSDR[]{
    let errors:ValidationErrorsNextSDR[] = [];

    if (!dominio.descrizione)
      errors.push({message:"E' necessario specificare una descrizione",validationSeverity:'ERROR',
        isBlocking:true, fieldName:'Descrizione'});

    return errors;
  }
}
