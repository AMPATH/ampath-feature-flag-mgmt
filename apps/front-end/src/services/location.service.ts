import { Injectable } from '@angular/core';

import { AmrsLocationResponse } from '../shared/types/app.types';
import { BaseService } from './base.service';

@Injectable({ providedIn: 'root' })
export class LocationService extends BaseService {
  private endPoint = '/locations';

  private getEndpoint(endPoint: string = this.endPoint) {
    return this.getUrl('FEATURE_FLAG') + endPoint;
  }

  public fetch() {
    const url = this.getEndpoint();
    return this.http.get<AmrsLocationResponse>(url);
  }
}
