import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment.development";
import { UserSelect } from "@app/shared/models/user-select";


@Injectable()
export class HttpLoginService {
    private httpClient = inject(HttpClient);
    private apiUrl = `${environment.urlApi}/`;

    getUsersLogin(): Observable<UserSelect[]> {
        return this.httpClient.get<UserSelect[]>(`${this.apiUrl}login-users`);
    }
}
