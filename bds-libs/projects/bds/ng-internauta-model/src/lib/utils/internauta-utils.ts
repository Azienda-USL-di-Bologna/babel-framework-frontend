export const LOCALHOST_PORT = "10005";

export enum BaseUrlType {
  Baborg,
  Messaggero,
  Permessi,
  Login,
  Logout,
  Ribaltone,
  RibaltoneUtils,
  Configurazione,
  Shpeck,
  ShpeckCommonParameters,
  ConfigurazioneImpostazioniApplicazioni,
  Intimus,
  Rubrica,
  Scrivania,
  ScrivaniaCommonParameters
}

export const BaseUrls: Map<BaseUrlType, string> = new Map<BaseUrlType, string>([
  [BaseUrlType.Baborg, "/internauta-api/resources/baborg"],
  [BaseUrlType.Messaggero, "/internauta-api/resources/messaggero"],
  [BaseUrlType.Permessi, "/internauta-api/resources/permessi"],
  [BaseUrlType.Login, "/internauta-api/login"],
  [BaseUrlType.Logout, "/Shibboleth.sso/Logout"],
  [BaseUrlType.Ribaltone, "/internauta-api/resources/baborg/ribaltone/lanciaRibaltone"],
  [BaseUrlType.RibaltoneUtils, "/internauta-api/resources/ribaltoneutils"],
  [BaseUrlType.Configurazione, "/internauta-api/resources/configurazione"],
  [BaseUrlType.Shpeck,  "/internauta-api/resources/shpeck"],
  [BaseUrlType.ShpeckCommonParameters,  "/internauta-api/resources/shpeck/getShpeckCommonParameters"],
  [BaseUrlType.ConfigurazioneImpostazioniApplicazioni, "/internauta-api/resources/configurazione/custom/setImpostazioniApplicazioni"],
  [BaseUrlType.Intimus, ""],
  [BaseUrlType.Rubrica, "/internauta-api/resources/rubrica"],
  [BaseUrlType.Scrivania, "/internauta-api/resources/scrivania"],
  [BaseUrlType.ScrivaniaCommonParameters,  "/internauta-api/resources/scrivania/getScrivaniaCommonParameters"]
]);

export function getInternautaUrl(type: BaseUrlType): string {
  if (!BaseUrls.has(type)) {
      throw new Error("Failed to obtain internauta url, type does not exists!");
  }

  let port;
  const wl = window.location;
  if (wl.hostname === "localhost" && type === BaseUrlType.Intimus) {
      return "placeholder";
  }
      // if (type === BaseUrlType.Intimus) {
      //     port = INTIMUS_LOCALHOST_PORT;
      // } else {
      //     port = LOCALHOST_PORT;
      // }
  if (wl.hostname === "localhost") {
      port = LOCALHOST_PORT;
  } else {
      port = wl.port;
  }

  const out: string = wl.protocol + "//" + wl.hostname + ":" + port + BaseUrls.get(type);

  console.log(out);

  return out;
}