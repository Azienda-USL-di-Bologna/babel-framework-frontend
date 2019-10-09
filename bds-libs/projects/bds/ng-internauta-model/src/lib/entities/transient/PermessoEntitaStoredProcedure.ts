import { EntitaStoredProcedure } from "./EntitaStoredProcedure";
import { PermessiStoredProcedure } from "./PermessiStoredProcedure";

export class PermessoEntitaStoredProcedure {
    soggetto: EntitaStoredProcedure;
    oggetto: EntitaStoredProcedure;
    permesso: PermessiStoredProcedure;
}
