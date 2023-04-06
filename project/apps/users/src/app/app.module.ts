import { Module } from '@nestjs/common';
import { BlogUserModule } from './blog-user/blog-user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [BlogUserModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
