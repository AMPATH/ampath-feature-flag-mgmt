import { IsNotEmpty, IsString } from 'class-validator';

export class AmrsSignInDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class AmrsPrivilege {
  uuid: string;
  display: string;
  name: string;
}

export class AmrsRole {
  uuid: string;
  display: string;
  name: string;
}

export class AmrsUser {
  uuid: string;
  display: string;
  username: string;
  systemId: string;
  userProperties: {
    loginAttempts: number;
    lockoutTimestamp: string;
  };
  person: {
    uuid: string;
    display: string;
  };
  privileges: AmrsPrivilege[];
  roles: AmrsRole[];
}

export class AmrsAuthResponse {
  authenticated: boolean;
  user: AmrsUser;
}

export class JwtAmrsUser {
  sub: string;
  user: {
    authenticated: boolean;
    username: string;
    roles: AmrsRole[];
  };
}
