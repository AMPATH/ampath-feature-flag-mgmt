import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.strategy';
import { AuthGuard } from './guard/auth.guard';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async login(
    @Request() req
  ): Promise<{ access_token: string; expires_at: number }> {
    const { user } = req;
    return this.authService.login(user);
  }

  @UseGuards(AuthGuard)
  @Get('test-guard')
  getProfile(@Request() req) {
    return req.user;
  }
}
