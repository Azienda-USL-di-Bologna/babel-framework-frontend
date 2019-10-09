import {ValidationErrorsNextSDR} from '@nfa/next-sdr';

export class ProdottoValidations{
  public static validate(prodotto:any):ValidationErrorsNextSDR[]{
    console.log("validate");

    let errors:ValidationErrorsNextSDR[] = [];

    if (!prodotto.descrizione)
      errors.push({message:"E' necessario specificare una descrizione",validationSeverity:'ERROR',
        isBlocking:true, fieldName:'Descrizione'});

    if (!prodotto.fornitore)
      errors.push({message:"E' necessario specificare un fornitore",validationSeverity:'ERROR',
        isBlocking:true, fieldName:'Fornitore'});

    console.log(errors);
    return errors;
  }
}
