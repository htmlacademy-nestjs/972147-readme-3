import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BlogUserModule } from '../blog-user/blog-user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessStrategy } from "./strategies/jwt-access.strategy";
import { JwtRefreshStrategy } from "./strategies/jwt-refresh.strategy";
import { MongooseModule } from "@nestjs/mongoose";
import { TokenSchema, TokenModel } from "./token.model";
import { TokenRepository } from "./token.repository";

@Module({
  imports: [
    BlogUserModule,
    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: TokenModel.name, schema: TokenSchema }
    ])
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAccessStrategy, JwtRefreshStrategy, TokenRepository],
})
export class AuthModule {}
