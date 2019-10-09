import {UtenteRole, UtenteRoleType} from '../LoggedUserInfo';
import {ValidationErrorsNextSDR} from '@nfa/next-sdr';

export class RuoliPerDominioValidations{
  public static validate(ruoloPerDominio:any):ValidationErrorsNextSDR[]{
    const errors:ValidationErrorsNextSDR[] = [];

    if (!ruoloPerDominio.utenteRole){
      errors.push({message:"É necessario specificare un ruolo.",validationSeverity:'ERROR',isBlocking:true,fieldName:'utenteRole'});
      return errors;
    }

    if (ruoloPerDominio.utenteRole === UtenteRoleType.ROLE_AMMINISTRATORE_SISTEMA ||
              ruoloPerDominio.utenteRole === UtenteRoleType.ROLE_SUPERVISORE_SISTEMA){
      if (ruoloPerDominio.dominio){
        errors.push({message:"Per il ruolo " + UtenteRole.GetRoleName(ruoloPerDominio.utenteRole) +
          " non è possibile specificare un dominio.",validationSeverity:'ERROR',isBlocking:true,fieldName:'dominio'});
      }
    } else {
      if (!ruoloPerDominio.dominio){
        errors.push({message:"Per il ruolo " + UtenteRole.GetRoleName(ruoloPerDominio.utenteRole) +
          " è necessario specificare un dominio.",validationSeverity:'ERROR',isBlocking:true,fieldName:'dominio'});
      }
    }

    return errors;
  }
}
