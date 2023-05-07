import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { bffConfig } from "@project/config/config-bff";
import { ConfigType } from "@nestjs/config";

@Injectable()
export class CheckAuthGuard implements CanActivate {
  constructor(
    @Inject(bffConfig.KEY)
    private readonly bffOptions: ConfigType<typeof bffConfig>,
    private readonly httpService: HttpService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { data } = await this.httpService.axiosRef.post(`${this.bffOptions.usersUrl}/auth/check`, {}, {
      headers: {
        'Authorization': request.headers['authorization']
      }
    })

    request['user'] = data;
    return true;
  }
}
