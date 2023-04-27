import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from '@project/shared/app-types';
import { Request } from 'express';

export const JWT_REFRESH_STRATEGY_NAME = 'jwt-refresh';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, JWT_REFRESH_STRATEGY_NAME) {
  constructor(
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('jwt.refreshTokenSecret'),
      passReqToCallback: true,
    });
  }

  public async validate(req: Request, payload: TokenPayload) {
    const refreshToken = req.get('Authorization')?.replace('Bearer', '').trim();
    return { ...payload, refreshToken };
  }
}
