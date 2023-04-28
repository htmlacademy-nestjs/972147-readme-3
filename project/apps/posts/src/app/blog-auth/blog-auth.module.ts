import { Module } from '@nestjs/common';
import { BlogAuthService } from './blog-auth.service';
import { AuthAccessStrategy } from "./strategies/auth-access.strategy";

@Module({
  providers: [BlogAuthService, AuthAccessStrategy],
})
export class BlogAuthModule {}
