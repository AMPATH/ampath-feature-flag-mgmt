import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { AttributeTypes } from '../attributes/attributes.types';
import { VoidDto } from '../shared/dialog/void-dialog/types';

@Injectable({ providedIn: 'root' })
export class AttributesService extends BaseService {
  private endPoint = '/attributes';

  private getEndpoint(endPoint: string = this.endPoint) {
    return this.getUrl('FEATURE_FLAG') + endPoint;
  }

  public fetch() {
    const url = this.getEndpoint();
    return this.http.get<AttributeTypes[]>(url);
  }

  public create(name: string, description: string, type: string) {
    const url = this.getEndpoint();
    return this.http.post(url, {
      name,
      description,
      type,
    });
  }

  public update(id: number, name: string, description: string, type: string) {
    const url = this.getEndpoint() + '/' + id;
    return this.http.patch(url, {
      name,
      description,
      type,
    });
  }

  public delete(id: number, voidDto: VoidDto) {
    const url = this.getEndpoint() + '/' + id;
    return this.http.delete(url, {
      body: {
        ...voidDto,
      },
    });
  }
}
