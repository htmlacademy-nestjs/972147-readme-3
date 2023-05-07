import { Module } from '@nestjs/common';
import { ConfigBffModule } from '@project/config/config-bff';
import { ConfigAppModule } from '@project/config/config-app';
import { ConfigRabbitmqModule } from '@project/config/config-rabbitmq';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AuthController } from "./auth.controller";
import { UsersController } from "./users.controller";
import { CheckAuthGuard } from "./guards/CheckAuthGuard";

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get('bff.httpClientTimeoutMs'),
        maxRedirects: configService.get('bff.httpClientMaxRedirects'),
      }),
      inject: [ConfigService],
    }),
    ConfigBffModule,
    ConfigAppModule,
    ConfigRabbitmqModule,
  ],
  controllers: [AuthController, UsersController],
  providers: [CheckAuthGuard]
})
export class AppModule {}
