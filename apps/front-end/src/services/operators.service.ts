import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { OperatorTypes } from "../operators/operators.types";

@Injectable({ providedIn: 'root' })
export class OperatorsService extends BaseService {
    private endPoint = "/operators";
    private session = this.sessionUtils.getSession();

    private getEndpoint(endPoint: string = this.endPoint) {
        return this.getUrl("FEATURE_FLAG") + endPoint;
    }

    public fetch() {
        const url = this.getEndpoint();
        return this.http.get<OperatorTypes[]>(url);
    }

    public create(name: string, description: string) {
        const url = this.getEndpoint();
        return this.http.post(url, {
            name,
            description,
            createdBy: this.session.username
        });
    }

    public update(id: number, name: string, description: string) {
        const url = this.getEndpoint() + "/" + id;
        return this.http.put(url, {
            name,
            description
        });
    }

    public delete() {
        const url = this.getEndpoint();
        return this.http.delete(url, {});
    }
}