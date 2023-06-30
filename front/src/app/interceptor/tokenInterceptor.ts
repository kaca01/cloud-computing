import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError} from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CognitoService } from '../services/cognito.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(public cognitoService: CognitoService, private _snackBar: MatSnackBar) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("token: ", this.cognitoService.getToken())
    if (this.cognitoService.tokenIsPresent()) {
        console.log("uslooooooo")
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${this.cognitoService.getToken()}` 
            }
        });
    }
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof ErrorEvent) {
        } else {
          if (error.status === 401) { 
            this.openSnackBar("Permission denied!");
          }
        }
        return throwError(error);
      })
    );;
  }

  openSnackBar(snackMsg : string) : void {
    this._snackBar.open(snackMsg, "Dismiss", {
      duration: 2000
    });
  }
}