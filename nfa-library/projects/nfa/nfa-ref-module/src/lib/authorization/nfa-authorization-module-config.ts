
export interface NfaAuthorizationModuleConfig {
  // se si invia eventi per notificare le operazioni di login account e login error;
  showToastMessageOnLoginEvent: boolean;
  extractUserIdentifier: (responseUser: any) => string;
  extractDataObject: (response: any) => any;
  extractErrorObject: (response: any) => any;

}
