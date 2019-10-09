export class HeaderFeaturesConfig {

    public BABELMAN_URL = "https://babelman-auslbo.avec.emr.it/";
    private _showUserFullName: boolean;
    private _showUserMenu: boolean;
    private _showCambioUtente: boolean;
    private _showProfilo: boolean;
    private _showManuale: boolean;
    private _showLogOut: boolean;
    private _logoutRedirectRoute: string;
    private _logoutIconPath: string;
    private _logoutWarning: boolean;


    get showUserFullName() {
        return this._showUserFullName;
    }

    set showUserFullName(value: boolean) {
        this._showUserFullName = value;
    }

    get showUserMenu() {
        return this._showUserMenu;
    }

    set showUserMenu(value: boolean) {
        this._showUserMenu = value;
    }

    get showCambioUtente() {
        return this._showCambioUtente;
    }

    set showCambioUtente(value: boolean) {
        this._showCambioUtente = value;
    }

    get showProfilo() {
        return this._showProfilo;
    }

    set showProfilo(value: boolean) {
        this._showProfilo = value;
    }

    get showManuale() {
        return this._showManuale;
    }

    set showManuale(value: boolean) {
        this._showManuale = value;
    }

    get showLogOut() {
        return this._showLogOut;
    }

    set showLogOut(value: boolean) {
        this._showLogOut = value;
    }

    get logoutRedirectRoute() {
        return this._logoutRedirectRoute || "";
    }

    set logoutRedirectRoute(value: string) {
        this._logoutRedirectRoute = value;
    }

    get logoutIconPath() {
        return this._logoutIconPath;
    }

    set logoutIconPath(value: string) {
        this._logoutIconPath = value;
    }

    get logoutWarning(): boolean {
        return this._logoutWarning;
    }

    set logoutWarning(value: boolean) {
        this._logoutWarning = value;
    }
}
