/**
 * parametri del modulo
 */
export interface NTJWTModuleConfig {
    loginURL?: string; // URL di login completo
    /**
     * URL di login relativo (solo la parte finale).
     * Se passato, l'URL sarà concatenatocalcolato prendendo la parte iniziale dell'indirizzo dell'applicazione
     */
    relativeURL?: string;

    /**
     * url della servlet che si occupa di settare le impostazioni dell'applicazione
     */
    setImpostazioniApplicazioniUrl?: string;

    /**
     * imposta il nome di rotta del componente di login
     */
    loginComponentRoute: string;

    /**
     * imposta il nome di rotta del componente di home; se l'utente richiede la pagina di login ma è già loggato deve
     * essere reindirizzato al componente di login
     */
    homeComponentRoute: string;

    /**
     * numero della porta quando si è in localhost
     */
    localhostPort: string;

    /**
     * id dell'applicazione
     */
    applicazione: string;

    /**
     * rotta in cui redirigere dopo il logout (e successivo re-login)
     */
    logoutRedirectRoute: string;

    /**
     * secondi dopo i quali la sessione scade e viene effettuato il logout automatico. Passare 0 per non abilitarlo
     */
    sessionExpireSeconds: number;

    /**
     * secondi dopo i quali viene rinfrescata le sessione sul server di SSO. Passare 0 per non rinfrescarlo mai
     */
    pingInterval: number;
}
