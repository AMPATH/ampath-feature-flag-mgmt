import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { RuleTypes } from "../rules/rules.types";

@Injectable({ providedIn: 'root' })
export class RulesService extends BaseService {
    private endPoint = "/rules";

    private getEndpoint(endPoint: string = this.endPoint) {
        return this.getUrl("FEATURE_FLAG") + endPoint;
    }

    public fetch() {
        const url = this.getEndpoint();
        return this.http.get<RuleTypes[]>(url);
    }

    public create(featureFlagId: number, attributeId: number, operatorId: number, value: string) {
        const url = this.getEndpoint();
        return this.http.post(url, {
            featureFlagId,
            attributeId,
            operatorId,
            value
        });
    }

    public update(id: number, featureFlagId: number, attributeId: number, operatorId: number, value: string) {
        const url = this.getEndpoint() + "/" + id;
        return this.http.patch(url, {
            featureFlagId,
            attributeId,
            operatorId,
            value
        });
    }

    public delete(id: number) {
        const url = this.getEndpoint() + "/" + id;
        return this.http.delete(url, { responseType: "text" });
    }
}