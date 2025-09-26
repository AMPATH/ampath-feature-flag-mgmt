import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { FeatureFlagTypes } from "../feature_flags/feature_flags.types";

@Injectable({ providedIn: 'root' })
export class FeatureFlagsService extends BaseService {
    private endPoint = "/feature-flags";

    private getEndpoint(endPoint: string = this.endPoint) {
        return this.getUrl("FEATURE_FLAG") + endPoint;
    }

    public fetch() {
        const url = this.getEndpoint();
        return this.http.get<FeatureFlagTypes[]>(url);
    }

    public create() {
        const url = this.getEndpoint();
        return this.http.post(url, {});
    }

    public update() {
        const url = this.getEndpoint();
        return this.http.put(url, {});
    }

    public delete() {
         const url = this.getEndpoint();
        return this.http.delete(url, {});
    }
}