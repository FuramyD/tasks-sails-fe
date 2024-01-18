import { Router } from "@angular/router";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Observable, of, switchMap } from "rxjs";

export function noAuthorizedGuard(): Observable<boolean> {
    const router = inject(Router);
    return inject(AuthService).isAuthenticated$.pipe(
        switchMap((isAuthenticated: boolean) => {
            if (!isAuthenticated) {
                return of(true);
            }

            return router.navigate(["/"]);
        }),
    );
}
