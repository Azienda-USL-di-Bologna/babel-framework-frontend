import { Entita } from "./entita";
import { CategoriaPermessi } from "./categoria-permessi";

export class PermessiEntita {
    soggetto: Entita;
    oggetto: Entita;
    categorie: CategoriaPermessi[];
}
