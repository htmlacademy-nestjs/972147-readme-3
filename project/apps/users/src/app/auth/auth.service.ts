import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { BlogUserEntity } from '../blog-user/blog-user.entity';
import { BlogUserDbRepository } from '../blog-user/repository/blog-user.db-repository';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload, User } from '@project/shared/app-types';
import { createHash } from 'node:crypto';
import { MAX_LOGINED_DEVICES_PER_USER } from './auth.config';
import { TokenRepository } from './token.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly blogUserRepository: BlogUserDbRepository,
    private readonly tokenRepository: TokenRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  private async hash(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private async validateUser(dto: LoginUserDto) {
    const { email, password } = dto;
    const existUser = await this.blogUserRepository.findByEmail(email);
    if (!existUser) {
      throw new UnauthorizedException();
    }
    const blogUserEntity = new BlogUserEntity(existUser);
    if (!(await blogUserEntity.checkPassword(password))) {
      throw new UnauthorizedException();
    }

    return blogUserEntity.toObject();
  }

  private async createUserTokens({ id }: User) {
    const payload: TokenPayload = { sub: id };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('jwt.accessTokenSecret'),
      expiresIn: this.configService.get<string>('jwt.accessTokenExpiresIn'),
      algorithm: 'HS256',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('jwt.refreshTokenSecret'),
      expiresIn: this.configService.get<string>('jwt.refreshTokenExpiresIn'),
      algorithm: 'HS256',
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  public async updateTokenHash(oldToken: string, newToken: string) {
    const oldTokenHash = await this.hash(oldToken);
    const newTokenHash = await this.hash(newToken);
    return this.tokenRepository.updateHash(oldTokenHash, newTokenHash);
  }

  public async getRefreshTokenPayload(refreshToken: string): Promise<TokenPayload & { iat: number; exp: number }> {
    const decoded = this.jwtService.decode(refreshToken);
    if (!decoded) {
      throw new UnauthorizedException();
    }
    return decoded as TokenPayload & { iat: number; exp: number };
  }

  public async validateRefreshToken(refreshToken: string) {
    const tokenHash = await this.hash(refreshToken);
    const token = await this.tokenRepository.findByHash(tokenHash);
    if (!token) {
      throw new UnauthorizedException();
    }
    await this.jwtService.verifyAsync(refreshToken, {
      secret: this.configService.get<string>('jwt.refreshTokenSecret'),
      algorithms: ['HS256'],
    });
  }

  private async revokeUnnecessaryRefreshTokens(userId: string) {
    const tokens = await this.tokenRepository.findAllByUserId(userId);
    if (tokens.length >= MAX_LOGINED_DEVICES_PER_USER) {
      await this.tokenRepository.deleteAllByUserId(userId);
    }
  }

  private async saveRefreshToken(refreshToken: string) {
    const tokenHash = await this.hash(refreshToken);
    const tokenPayload = await this.getRefreshTokenPayload(refreshToken);
    await this.tokenRepository.create({
      refreshTokenHash: tokenHash,
      userId: tokenPayload.sub,
      expiresAt: new Date(tokenPayload.exp * 1000),
      issuedAt: new Date(tokenPayload.iat * 1000),
    });
  }

  public async login(dto: LoginUserDto) {
    const user = await this.validateUser(dto);
    await this.revokeUnnecessaryRefreshTokens(user.id);
    const tokens = await this.createUserTokens(user);
    await this.saveRefreshToken(tokens.refreshToken);
    return tokens;
  }

  public async loginByRefreshToken(refreshToken: string) {
    await this.validateRefreshToken(refreshToken);
    const tokenPayload = await this.getRefreshTokenPayload(refreshToken);
    const user = await this.blogUserRepository.get(tokenPayload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    const tokens = await this.createUserTokens(user);
    await this.updateTokenHash(refreshToken, tokens.refreshToken);
    return tokens;
  }

  public async logoutAll(refreshToken: string) {
    const tokenPayload = await this.getRefreshTokenPayload(refreshToken);
    await this.tokenRepository.deleteAllByUserId(tokenPayload.sub);
  }

  public async logout(refreshToken: string) {
    const tokenHash = await this.hash(refreshToken);
    await this.tokenRepository.deleteOne(tokenHash);
  }
}
