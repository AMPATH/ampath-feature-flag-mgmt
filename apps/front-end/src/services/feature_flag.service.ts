import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { FeatureFlagTypes } from "../feature_flags/feature_flags.types";

@Injectable({ providedIn: 'root' })
export class FeatureFlagsService extends BaseService {
    private endPoint = "/feature-flags";
    private session = this.sessionUtils.getSession();

    private getEndpoint(endPoint: string = this.endPoint) {
        return this.getUrl("FEATURE_FLAG") + endPoint;
    }

    public fetch() {
        const url = this.getEndpoint();
        return this.http.get<FeatureFlagTypes[]>(url);
    }

    public create(name: string, description: string, status: boolean) {
        const url = this.getEndpoint();
        return this.http.post(url, {
            name,
            description,
            status,
            createdBy: this.session.username,
            updatedBy: "",
            retiredBy: this.session.username,
            retired: false
        });
    }

    public update(id: number, description: string, status: boolean, retired: boolean) {
        const url = this.getEndpoint() + "/" + id;
        return this.http.put(url, {
            description,
            status,
            retired,
            updatedBy: this.session.username
        });
    }

    public delete() {
        const url = this.getEndpoint();
        return this.http.delete(url, {});
    }
}