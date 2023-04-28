import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthAccessStrategy } from '../strategies/auth-access.strategy';

@Injectable()
export class AuthAccessGuard extends AuthGuard(AuthAccessStrategy.key) {
}
