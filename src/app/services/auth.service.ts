import { inject, Injectable } from "@angular/core";
import { Observable, ReplaySubject, tap } from "rxjs";
import { BACKEND_URL } from "../tokens/backend-url.token";
import { SESSION_STORAGE } from "../tokens/storage.token";
import { ACCESS_TOKEN } from "../constants/auth.constants";
import { HttpClient } from "@angular/common/http";
import { LoginPayload } from "../models/payloads/auth/login.payload";
import { LoginResponse } from "../models/responses/login.response";
import { RegisterPayload } from "../models/payloads/auth/register.payload";
import { RegisterResponse } from "../models/responses/register.response";
import { Router } from "@angular/router";
import { JwtPayload } from "../models/payloads/users/jwt.payload";

@Injectable({
    providedIn: "root"
})
export class AuthService {
    private readonly backendUrl: string = inject(BACKEND_URL);
    private readonly sessionStorageRef: Storage = inject(SESSION_STORAGE);
    private readonly httpClient: HttpClient = inject(HttpClient);
    private readonly router = inject(Router);

    private readonly setIsAuthenticated$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

    public readonly isAuthenticated$: Observable<boolean> = this.setIsAuthenticated$.asObservable();

    public set accessToken(token: string | null) {
        typeof token === "string"
            ? this.sessionStorageRef.setItem(ACCESS_TOKEN, token)
            : this.sessionStorageRef.removeItem(ACCESS_TOKEN);
    }

    public get accessToken(): string | null {
        return this.sessionStorageRef.getItem(ACCESS_TOKEN);
    }

    constructor() {
        this.setIsAuthenticated$.next(!!this.accessToken);
    }

    public getCurrentUserInfo(): JwtPayload | null {
        return this.accessToken
            ? this.parseJwt(this.accessToken)
            : null;
    }

    public login(loginPayload: LoginPayload): Observable<LoginResponse> {
        return this.httpClient.post<LoginResponse>(`${this.backendUrl}/users/login`, loginPayload).pipe(
            tap((response: LoginResponse) => {
                this.accessToken = response.accessToken;
                this.setIsAuthenticated$.next(true);
            })
        );
    }

    public register(registerPayload: RegisterPayload): Observable<RegisterResponse> {
        return this.httpClient.post<RegisterResponse>(`${this.backendUrl}/users/register`, registerPayload);
    }

    public logout(): void {
        this.accessToken = null;
        this.setIsAuthenticated$.next(false);
        this.router.navigate(["/login"]);
    }

    private parseJwt(token: string): JwtPayload {
        var base64Url: string = token.split('.')[1];
        var base64: string = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload: string = decodeURIComponent(
            window.atob(base64)
                .split('')
                .map((c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        return JSON.parse(jsonPayload);
    }


}
