import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthAccessStrategy } from "./strategies/auth-access.strategy";

@Module({
  providers: [AuthService, AuthAccessStrategy],
})
export class AuthModule {}
