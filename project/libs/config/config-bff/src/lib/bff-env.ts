import { IsPositive, IsUrl } from "class-validator";
import { BffConfig } from './bff.config';

export class BffEnv implements BffConfig {
  @IsUrl({ require_tld: false })
  public usersUrl!: string;

  @IsUrl({ require_tld: false })
  public postsUrl!: string;

  @IsUrl({ require_tld: false })
  public filesUrl!: string;

  @IsUrl({ require_tld: false })
  public notificationUrl!: string;

  @IsPositive()
  public httpClientMaxRedirects!: number;

  @IsPositive()
  public httpClientTimeoutMs!: number;
}
