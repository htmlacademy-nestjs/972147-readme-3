export abstract class TokenPayload {
  public sub!: string;
  public accessTokenId!: string;
  public refreshTokenId!: string;
  public iat?: number;
  public exp?: number;
}
