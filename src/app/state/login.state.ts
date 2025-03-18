import { inject, Injectable, resource } from "@angular/core";
import { HttpLoginService } from "@app/serviceshttp/http-login.service";
import { lastValueFrom } from "rxjs";

@Injectable()
export class LoginState {
    private httpLoginService = inject(HttpLoginService);

    loginUsersResource = resource<any, {
        accountId: string
    }>({
        loader: async ({ request }) => {
            const response = await lastValueFrom(this.httpLoginService.getUsersLogin());
            return response;
        }
    });
}
