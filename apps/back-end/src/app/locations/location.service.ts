import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { expand, map, of, reduce } from 'rxjs';
import { base64Encode } from '../common/utils/base-64-encode';
import { AmrsLocationResponse, LocationResponseLink } from '../common/dto';
import { ConfigService } from '@nestjs/config';
import { AmrsSignInDto } from '../auth/dto/amrs-auth.dto';

@Injectable()
export class LocationService {
  private baseUrl = 'https://ngx.ampath.or.ke/amrs/ws/rest/v1';

  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService
  ) {}

  public getAllLocations() {
    let startIndex = 0;
    return this.fetchLocations(startIndex).pipe(
      expand((res) => {
        if (this.hasNextPage(res.data.links)) {
          startIndex += 500;
          return this.fetchLocations(startIndex);
        } else {
          return of();
        }
      }),
      map((res) => res.data.results),
      reduce((acc, results) => acc.concat(results as any), []),
      map((allData) => ({ results: allData }))
    );
  }

  private getAmrsSignInDto() {
    const signInDto: AmrsSignInDto = {
      username: this.configService.get('AMRS_USER'),
      password: this.configService.get('AMRS_USER_PW'),
    };
    return signInDto;
  }

  private fetchLocations(startIndex: number) {
    const authorizationString = base64Encode(this.getAmrsSignInDto());
    return this.httpService.get<AmrsLocationResponse>(
      this.baseUrl.trim() + '/location',
      {
        params: {
          startIndex: String(startIndex),
          v: 'default',
        },
        headers: {
          Authorization: `Basic ${authorizationString}`,
        },
      }
    );
  }

  private hasNextPage(links: LocationResponseLink[]): boolean {
    if (!links) {
      return false;
    }
    return links.some((l) => {
      return l.rel === 'next';
    });
  }
}
