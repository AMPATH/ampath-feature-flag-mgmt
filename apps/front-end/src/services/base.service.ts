import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { ServiceUtils } from "./utils/service.utils";
import { SessionUtils } from "./utils/sessions.utils";
import { UrlSource } from "./base.service.types";

@Injectable({ providedIn: 'root' })
export class BaseService {
    public serviceUtils = inject(ServiceUtils);
    public http = inject(HttpClient);
    public sessionUtils = inject(SessionUtils);

    public getHttpHeaders = () => {
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        return headers;
    }

    public getUrl(urlSource: UrlSource): string {
        if(urlSource === "FEATURE_FLAG") {
            return this.serviceUtils.getFFUrl();
        }
        return this.serviceUtils.getAMRSUrl();
    }
}