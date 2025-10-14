import { Injectable } from '@nestjs/common';
import { AmrsAuthResponse, AmrsSignInDto } from './dto/amrs-auth.dto';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class AmrsAuthService {
  private baseUrl = 'https://ngx.ampath.or.ke/amrs/ws/rest/v1';

  constructor(private readonly httpService: HttpService) {}

  public async authenticate(signInDto: AmrsSignInDto) {
    const authUrl = `${this.baseUrl}/session`;
    const authorizationString = this.base64Encode(signInDto);
    const { data } = await firstValueFrom(
      this.httpService
        .get<AmrsAuthResponse>(authUrl, {
          headers: {
            Authorization: `Basic ${authorizationString}`,
          },
        })
        .pipe(
          catchError((__: AxiosError) => {
            throw 'An error happened!';
          })
        )
    );
    return data;
  }
  private base64Encode(signInDto: AmrsSignInDto) {
    const textToEncode = `${signInDto.username}:${signInDto.password}`;
    const encodedString = btoa(textToEncode);
    return encodedString;
  }
}
