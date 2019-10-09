import {Injectable} from '@angular/core';
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler, HttpHeaders,
    HttpInterceptor,
    HttpRequest,
    HttpResponse
} from '@angular/common/http';

import { catchError } from 'rxjs/operators';


import {ON_401_RESPONSE, ON_500_RESPONSE} from '@nfa/ref';
import {BroadcastProvider} from '@nfa/core';
import {Observable, throwError} from 'rxjs';

@Injectable()
export class HttpInterceptorProvider implements HttpInterceptor {

    SERVICE_HEADERS_EXCLUDE_INTERCEPTOR = 'exclude-interceptor';

  constructor(protected _broadcastProvider: BroadcastProvider) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const isUseInterceptor = this.isUseInterceptor(req);
      req = this.deleteServiceHeaders(req);
      if (isUseInterceptor) {
          // aggiungo il withCredential
          const editReq: HttpRequest<any> = req.clone({withCredentials: true});
          // intercetto gli errori 500 e 401
          return next.handle(editReq).pipe(catchError((error, caught) => {
              if (error instanceof HttpErrorResponse) {
                  switch (error.status) {
                      case 401:
                          this._broadcastProvider.broadcast(ON_401_RESPONSE, error);
                          break;
                      case 500:
                          this._broadcastProvider.broadcast(ON_500_RESPONSE, error);
                          break;
                  }
                  return throwError(error);
              }

          }));
      } else {
          return next.handle(req);
      }
    

      // .catch((error: any, caught) => {
      //   if (error instanceof HttpErrorResponse) {
      //     switch (error.status) {
      //       case 401:
      //         this._broadcastProvider.broadcast(ON_401_RESPONSE, error);
      //         break;
      //       case 500:
      //         this._broadcastProvider.broadcast(ON_500_RESPONSE, error);
      //         break;
      //     }
      //     return Observable.throw(error);
      //   }
      // });
  }

    /**
     * Definisce se far partire l'interceptor o meno.
     * Per non farlo partire questo deve essere definito e avere valore true
     * Se presente l'header viene eliminato prima di inviare la richiesta visto che è utilizzato solo internamente
     * @param req
     */
    protected isUseInterceptor(req: HttpRequest<any>): boolean {
        const headers: HttpHeaders = req.headers;
        if (headers && headers.has(this.getExcludeInterceptorHeaderName())) {
            const excludeInterceptorValue = headers.get(this.getExcludeInterceptorHeaderName());
            if (excludeInterceptorValue === 'true') {
                return false;
            }
        }
        return true;
    }


    /**
     * Rimuove gli headers di servizio
     * @param req
     */
    protected deleteServiceHeaders(req: HttpRequest<any>): HttpRequest<any> {
        let httpHeaders: HttpHeaders = req.headers;
        for (const serviceHeader of this.getServiceHeaders()) {
            if (httpHeaders.has(serviceHeader)) {
                httpHeaders = httpHeaders.delete(serviceHeader);
            }
        }
        return req.clone({headers: httpHeaders});
    }

    /**
     * Il nome dell'header per eseguire o meno l'interceptor
     */
    protected getExcludeInterceptorHeaderName(): string {
      return this.SERVICE_HEADERS_EXCLUDE_INTERCEPTOR;
    }

    /**
     * Ritorna i service header ovvero gli headers che mi servono internamente e che devono essere rimossi prima di fare la chiamata
     */
    protected getServiceHeaders(): string[] {
        const result = [this.getExcludeInterceptorHeaderName()];
        return result;
    }



}
