import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";

@Injectable({ providedIn: 'root' })
export class AuthenticationService extends BaseService {
    public authenticate(username: string, password: string) {
        const url = this.getUrl("FEATURE_FLAG") + "/auth/login";
        return this.http.post(url, { username: username, password: password });
    }

    public deleteSession() {
        const url = this.getUrl("AMRS");
        return this.http.delete(url, {});
    }
}