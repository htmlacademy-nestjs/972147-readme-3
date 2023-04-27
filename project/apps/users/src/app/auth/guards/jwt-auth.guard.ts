import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JWT_ACCESS_STRATEGY_NAME } from "../strategies/jwt-access.strategy";

@Injectable()
export class JwtAuthGuard extends AuthGuard(JWT_ACCESS_STRATEGY_NAME) {
}
