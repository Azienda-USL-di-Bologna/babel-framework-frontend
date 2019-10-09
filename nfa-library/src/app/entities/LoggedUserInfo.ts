export class LoginResultDTO {
  utenteDTO: UtenteDTO;
  ruoloPerDominioDTO: RuoloPerDominioDTO;
  ruoliPerDominioDTODisponibili: RuoloPerDominioDTO[];
}

export class UtenteDTO {
  nome: string;
  cognome: string;
  username: string;
  email: string;
}

export class RuoloPerDominioDTO {
  id: number;
  idDominio?: number;
  descrizioneDominio?: string;
  utenteRole: UtenteRoleType;
}

export enum UtenteRoleType  {
    ROLE_AMMINISTRATORE_SISTEMA = 'ROLE_AMMINISTRATORE_SISTEMA',
    ROLE_SUPERVISORE_SISTEMA = 'ROLE_SUPERVISORE_SISTEMA',
    ROLE_AMMINISTRATORE_DOMINIO = 'ROLE_AMMINISTRATORE_DOMINIO',
    ROLE_SUPERVISORE_DOMINIO = 'ROLE_SUPERVISORE_DOMINIO',
    ROLE_MONITOR = 'ROLE_MONITOR',
    ROLE_DEC = 'ROLE_DEC',
    ROLE_NO_DOMINIO = 'ROLE_NO_DOMINIO'
  }

export class UtenteRole{
  public static GetRoleName(roleType:UtenteRoleType):string {
    switch (roleType){
      case UtenteRoleType.ROLE_AMMINISTRATORE_SISTEMA:
        return "Amministratore di sistema";
      case UtenteRoleType.ROLE_SUPERVISORE_SISTEMA:
        return "Supervisore di sistema";
      case UtenteRoleType.ROLE_AMMINISTRATORE_DOMINIO:
        return "Amministratore di dominio";
      case UtenteRoleType.ROLE_SUPERVISORE_DOMINIO:
        return "Supervisore di dominio";
      case UtenteRoleType.ROLE_MONITOR:
        return "Monitor";
      case UtenteRoleType.ROLE_DEC:
        return "DEC";
      case UtenteRoleType.ROLE_NO_DOMINIO:
        return "Nessun dominio/ruolo indicato";
      default:
        return "Nessun Ruolo";
    }
  }
}
