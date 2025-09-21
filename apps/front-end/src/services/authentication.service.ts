import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ServiceUtils } from "./utils/service.utils";
import { inject, Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private serviceUtils = inject(ServiceUtils);
    private http = inject(HttpClient);

    public authenticate(username: string, password: string) {
        let headers = new HttpHeaders();

        const base64 = btoa(username + ':' + password);
        headers = headers.append('Authorization', 'Basic ' + base64);

        const url = this.getUrl();
        return this.http.get(url, { headers: headers });
    }

    public getUrl(): string {
        return this.serviceUtils.getAMRSUrl();
    }

    public deleteSession() {
        const url = this.getUrl();
        return this.http.delete(url, {});
    }
}