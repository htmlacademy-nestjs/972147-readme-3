import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { User } from '@project/shared/app-types';
import { AuthService } from '../auth.service';

const AUTH_ACCESS_STRATEGY_NAME = 'auth-access';

@Injectable()
export class AuthAccessStrategy extends PassportStrategy(Strategy, AUTH_ACCESS_STRATEGY_NAME) {
  public static readonly key = AUTH_ACCESS_STRATEGY_NAME;
  constructor(
    private readonly authService: AuthService,
  ) {
    super();
  }

  public async validate(req: Request): Promise<User> {
    const token = req.get('Authorization');
    if (!token) {
      throw new UnauthorizedException();
    }
    return await this.authService.getUserInfo(token);
  }
}
