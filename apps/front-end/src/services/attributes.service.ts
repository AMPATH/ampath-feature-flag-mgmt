import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { AttributeTypes } from "../attributes/attributes.types";

@Injectable({ providedIn: 'root' })
export class AttributesService extends BaseService {
    private endPoint = "/attributes";
    private session = this.sessionUtils.getSession();

    private getEndpoint(endPoint: string = this.endPoint) {
        return this.getUrl("FEATURE_FLAG") + endPoint;
    }

    public fetch() {
        const url = this.getEndpoint();
        return this.http.get<AttributeTypes[]>(url);
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