import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AmrsAuthService } from './amrs-auth.service';
import { AmrsAuthResponse, JwtAmrsUser } from './dto/amrs-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private amrsAuthService: AmrsAuthService,
    private jwtService: JwtService
  ) {}

  async validateUser(
    username: string,
    password: string
  ): Promise<AmrsAuthResponse> {
    const amrsUser = await this.amrsAuthService.authenticate({
      username,
      password,
    });
    if (!amrsUser) throw new NotFoundException('Wrong username or password!');
    if (!amrsUser.authenticated) {
      throw new UnauthorizedException();
    }
    return amrsUser;
  }
  async login(user: AmrsAuthResponse) {
    const jwtUser: JwtAmrsUser = {
      sub: user.user.systemId,
      user: {
        authenticated: user.authenticated,
        username: user.user.username,
        roles: user.user.roles,
      },
    };
    const token = await this.jwtService.signAsync(jwtUser);
    return {
      user: user,
      access_token: token,
      expires_at: this.getTokenExpiryTime(),
    };
  }
  private getTokenExpiryTime(): number {
    const now = new Date();
    const expiryTime = Number(process.env.JWT_EXPIRATION);
    const expiry = now.setSeconds(now.getSeconds() + expiryTime);
    return expiry;
  }
}
