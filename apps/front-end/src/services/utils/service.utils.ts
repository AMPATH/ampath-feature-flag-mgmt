import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class ServiceUtils {
    private static readonly AMRS_URL = "https://ngx.ampath.or.ke/amrs/ws/rest/v1/session";
    private static readonly FF_URL = "";

    public getAMRSUrl() {
        return ServiceUtils.AMRS_URL;
    }

    public getFFUrl() {
        return ServiceUtils.FF_URL;
    }
}