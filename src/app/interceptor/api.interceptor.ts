import {
  HttpErrorResponse, HttpEvent, HttpHandler,

  HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor() {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>  {
    const authReq = request.clone({
      url: environment.githubUrl + request.url
      });
    return next.handle(authReq).pipe(
      retry(1),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        /* We can bring in all the authentication layer  and do redirections to specific urls */
        if (error.status in [500, 400, 401]) {
          errorMessage = `Error: ${error.error.message}`;
        } else {
          console.log(error);
        }
        return throwError(errorMessage);
      })
    );
  }

}
