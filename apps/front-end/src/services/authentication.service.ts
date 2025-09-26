import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";

@Injectable({ providedIn: 'root' })
export class AuthenticationService extends BaseService {
    public authenticate(username: string, password: string) {
        let headers = this.getHttpHeaders();
        const base64 = btoa(username + ':' + password);
        headers = headers.append('Authorization', 'Basic ' + base64);

        const url = this.getUrl("AMRS");
        return this.http.get(url, { headers: headers });
    }

    public deleteSession() {
        const url = this.getUrl("AMRS");
        return this.http.delete(url, {});
    }
}