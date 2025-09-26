import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { OperatorTypes } from "../operators/operators.types";

@Injectable({ providedIn: 'root' })
export class OperatorsService extends BaseService {
    private endPoint = "/operators";

    private getEndpoint(endPoint: string = this.endPoint) {
        return this.getUrl("FEATURE_FLAG") + endPoint;
    }

    public fetch() {
        const url = this.getEndpoint();
        return this.http.get<OperatorTypes[]>(url);
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