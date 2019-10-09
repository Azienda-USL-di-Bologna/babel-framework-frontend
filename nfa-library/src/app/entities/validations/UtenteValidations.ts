import {RuoliPerDominioValidations} from './RuoliPerDominioValidations';
import {ValidationErrorsNextSDR} from '@nfa/next-sdr';

export class UtenteValidations{
  public static validate(utente:any):ValidationErrorsNextSDR[]{
    let errors:ValidationErrorsNextSDR[] = [];

    for (const utenteRole of utente.ruoliPerDomini){
      errors = errors.concat(RuoliPerDominioValidations.validate(utenteRole));
    }

    if (errors.length === 0){
      for (const ruoloPerDominio of utente.ruoliPerDomini){
        if (utente.ruoliPerDomini.filter(
            (currRuolo:any) => {

              const currRuoloDominio = currRuolo.dominio ? currRuolo.dominio.id : null;
              const ruoloDominioDominio = ruoloPerDominio.dominio ? ruoloPerDominio.dominio.id : null;

              return currRuolo.id !== ruoloPerDominio.id &&
                currRuoloDominio !== ruoloDominioDominio
                && currRuolo.utenteRole === ruoloPerDominio.utenteRole;
            }).length > 0 )
        errors.push({message:"Non è possibile specificare più volte la stessa combinazione di ruolo e dominio.",validationSeverity:'ERROR',
          isBlocking:true});
      }
    }

    return errors;
  }
}
