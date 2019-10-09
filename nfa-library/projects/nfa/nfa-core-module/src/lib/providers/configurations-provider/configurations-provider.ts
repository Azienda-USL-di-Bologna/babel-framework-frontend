import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ConfigurationsProvider {

 // protected configurationPath = '/resources/config/config.dev.xml';
  protected configurationNodeName = 'config';

  private _configurationsMap: Map<string, any>;

  constructor(@Inject('configurationPath') protected configurationPath: string, protected _http: HttpClient) {

  }

  public loadConfiguration(): Promise<void> {
     return this._http.get(this.configurationPath, {responseType: 'text'}).toPromise()
        .then((value) => {
          this.parseConfiguration(value);
        },
            (error2) => {
          console.error(error2);
        });
    }

  public getConfiguration(configurationName: string): any {
    if (this._configurationsMap.has(configurationName)) {
      return this._configurationsMap.get(configurationName);
    }
    return null;
}

  protected parseConfiguration(value: string): void {

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(value, 'text/xml');
    if (xmlDoc) {
      for (let _i = 0; _i < xmlDoc.childNodes.length; _i++) {
        const childNode: Node = xmlDoc.childNodes.item(_i);
        if (childNode.nodeName === this.configurationNodeName) {
            this.fillConfigurationsMap(childNode);
        }
      }
    }
  //  parseString(value, () => this.fillMap);
  }

  protected fillConfigurationsMap(configNode: Node) {
    this._configurationsMap = new Map();
    for (let _i = 0; _i < configNode.childNodes.length; _i++) {
      const childNode: Node = configNode.childNodes.item(_i);
      if (childNode.nodeType !== Node.TEXT_NODE) {
        this._configurationsMap.set(childNode.nodeName, childNode.textContent);
      }
    }
  }

  // protected fillMap2(error, result): void {
  //   if (result.config) {
  //     this._configurationsMap = new Map();
  //     const config = result.config;
  //     for (const property in config) {
  //       if (config.hasOwnProperty(property)) {
  //         this._configurationsMap.set(property, config[property]);
  //       }
  //     }
  //   }
  // }

}
