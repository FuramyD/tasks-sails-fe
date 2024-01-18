import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { Observable, of, switchMap } from "rxjs";


export function authorizedGuard(): Observable<boolean> {
    const router = inject(Router);
    return inject(AuthService).isAuthenticated$.pipe(
        switchMap((isAuthenticated: boolean) => {
            if (isAuthenticated) {
                return of(true);
            }

            return router.navigate(["/login"]);
        })
    );
}
