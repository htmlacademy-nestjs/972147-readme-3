import { Module } from '@nestjs/common';
import { BlogUserModule } from './blog-user/blog-user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigUsersModule } from '@project/config/config-users';

@Module({
  imports: [BlogUserModule, AuthModule, ConfigUsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
