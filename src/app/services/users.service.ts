import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "../models/payloads/users/user.model";
import { HttpClient } from "@angular/common/http";
import { BACKEND_URL } from "../tokens/backend-url.token";


@Injectable({ providedIn: "root" })
export class UsersService {
    private readonly httpClient: HttpClient = inject(HttpClient);
    private readonly backendEndpoint: string = inject(BACKEND_URL);

    public getUsers(search: string): Observable<User[]> {
        return this.httpClient.get<User[]>(`${this.backendEndpoint}/users`, {
            params: {
                ...search?.length > 0 && { search }
            }
        });
    }
}
