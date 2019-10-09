import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { PermessiEntita } from "../permessi-types/permessi-entita";
import { UtilityFunctions } from "@nfa/next-sdr";
import { DatePipe } from "@angular/common";

export abstract class PermissionManagerService {


  constructor(protected _http: HttpClient, protected permissionBaseUrl, protected datepipe: DatePipe) {
  }

  managePermission(permessi: PermessiEntita[]): Observable<any> {
    return this._http.post(this.permissionBaseUrl + "/managePermissions", UtilityFunctions.cleanArrayForHttpCall(permessi, this.datepipe));
  }

  managePermissionsGestoriPec(json: any): Observable<any> {
    return this._http.post(this.permissionBaseUrl + "/managePermissionsGestoriPec",
      UtilityFunctions.cleanArrayForHttpCall(json, this.datepipe));
  }

  managePermissionsAssociazioniPecStruttura(json: any): Observable<any> {
    return this._http.post(this.permissionBaseUrl + "/managePermissionsAssociazioniPecStruttura",
      UtilityFunctions.cleanArrayForHttpCall(json, this.datepipe));
  }
}
