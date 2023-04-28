import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import fetch from 'node-fetch';
import { User } from '@project/shared/app-types';
import { HttpException } from "@nestjs/common/exceptions/http.exception";

@Injectable()
export class BlogAuthService {
  constructor(private readonly configService: ConfigService) {}

  private getProfileUrl() {
    const protocol = this.configService.get<string>('users.protocol');
    const host = this.configService.get<string>('users.host');
    const port = this.configService.get<number>('users.port');
    const profilePath = this.configService.get<string>('users.profilePath');
    return `${protocol}://${host}:${port}${profilePath}`;
  }

  public async getUserInfo(token: string): Promise<User> {
    const response = await fetch(this.getProfileUrl(), { headers: { Authorization: token } });
    if (response.ok) {
      const user = await response.json();
      return user as User;
    }
    throw new HttpException(response.statusText, response.status);
  }
}
