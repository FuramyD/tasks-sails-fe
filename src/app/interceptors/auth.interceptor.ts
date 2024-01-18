import { inject, Injectable } from "@angular/core";
import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { AuthService } from "../services/auth.service";


export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const authService: AuthService = inject(AuthService);

    return authHandler(req, next).pipe(
        catchError((error: HttpErrorResponse) => {
            if ([401, 403].includes(error.status)) {
                authService.logout();
            }

            return throwError(() => error);
        })
    );
}

function authHandler(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const authService: AuthService = inject(AuthService);

    if (!authService.accessToken) {
        return next(req);
    }

    return next(req.clone({
        setHeaders: {
            "Authorization": `Bearer ${authService.accessToken}`
        }
    }))
}
