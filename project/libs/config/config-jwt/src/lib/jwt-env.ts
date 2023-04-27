import { IsNotEmpty, IsString } from "class-validator";
import { JwtConfig } from "./jwt.config";

enum EnvValidationMessage {
  AccessTokenSecretRequired = 'Access token secret is not provided',
  RefreshTokenSecretRequired = 'Refresh token secret is not provided',
  AccessTokenExpiresInRequired = 'Access token expires in is not provided',
  RefreshTokenExpiresInRequired = 'Access token expires in is not provided',
}

export class JwtEnv implements JwtConfig {
  @IsString({ message: EnvValidationMessage.AccessTokenSecretRequired})
  @IsNotEmpty()
  public accessTokenSecret!: string;

  @IsString({ message: EnvValidationMessage.RefreshTokenSecretRequired})
  @IsNotEmpty()
  public refreshTokenSecret!: string;

  @IsString({ message: EnvValidationMessage.AccessTokenExpiresInRequired})
  @IsNotEmpty()
  public accessTokenExpiresIn!: string;

  @IsString({ message: EnvValidationMessage.RefreshTokenExpiresInRequired})
  @IsNotEmpty()
  public refreshTokenExpiresIn!: string;
}
