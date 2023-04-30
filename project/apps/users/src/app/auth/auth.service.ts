import { BadRequestException, Injectable, UnauthorizedException, Inject } from "@nestjs/common";
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { LoginUserDto } from './dto/login-user.dto';
import { BlogUserEntity } from '../blog-user/blog-user.entity';
import { BlogUserDbRepository } from '../blog-user/repository/blog-user.db-repository';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload, User } from '@project/shared/app-types';
import { randomUUID } from 'node:crypto';
import { MAX_LOGINED_DEVICES_PER_USER } from './auth.config';
import { TokenRepository } from './token.repository';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly blogUserRepository: BlogUserDbRepository,
    private readonly tokenRepository: TokenRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {
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
    const accessTokenId = randomUUID();
    const refreshTokenId = randomUUID();
    const payload: TokenPayload = { sub: id, accessTokenId, refreshTokenId };
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

  private async updateRefreshToken(oldTokenId: string, newRefreshToken: string) {
    await this.tokenRepository.deleteOneByRefreshTokenId(oldTokenId);
    await this.saveRefreshToken(newRefreshToken);
  }

  private getTokenPayload(token: string): Required<TokenPayload> {
    const decoded = this.jwtService.decode(token);
    if (!decoded) {
      throw new UnauthorizedException();
    }
    return decoded as Required<TokenPayload>;
  }

  private async validateRefreshToken(refreshTokenId: string) {
    const token = await this.tokenRepository.findByRefreshTokenId(refreshTokenId);
    if (!token) {
      throw new UnauthorizedException();
    }
  }

  private async revokeUnnecessaryRefreshTokens(userId: string) {
    const tokens = await this.tokenRepository.findAllByUserId(userId);
    if (tokens.length >= MAX_LOGINED_DEVICES_PER_USER) {
      await this.tokenRepository.deleteAllByUserId(userId);
    }
  }

  private async saveRefreshToken(refreshToken: string) {
    const payload = this.getTokenPayload(refreshToken);
    await this.tokenRepository.create({
      refreshTokenId: payload.refreshTokenId,
      userId: payload.sub,
      expiresAt: new Date(payload.exp * 1000),
      issuedAt: new Date(payload.iat * 1000),
    });
  }

  private async saveAccessToken(token: string) {
    const payload = this.getTokenPayload(token);
    await this.cacheManager.set(payload.accessTokenId, payload.sub, (payload.exp - payload.iat) * 1000);
  }

  public async validateAccessToken(payload: TokenPayload) {
    const cachedToken = await this.cacheManager.get(payload.accessTokenId);
    if (!cachedToken) {
      throw new UnauthorizedException();
    }
  }

  public async login(dto: LoginUserDto) {
    const user = await this.validateUser(dto);
    await this.revokeUnnecessaryRefreshTokens(user.id);
    const tokens = await this.createUserTokens(user);
    await this.saveRefreshToken(tokens.refreshToken);
    await this.saveAccessToken(tokens.accessToken);
    return tokens;
  }

  public async loginByRefreshToken(payload: TokenPayload) {
    await this.validateRefreshToken(payload.refreshTokenId);
    const user = await this.blogUserRepository.get(payload.sub);
    if (!user) {
      throw new BadRequestException();
    }
    const tokens = await this.createUserTokens(user);
    await this.cacheManager.del(payload.accessTokenId);
    await this.updateRefreshToken(payload.refreshTokenId, tokens.refreshToken);
    await this.saveAccessToken(tokens.accessToken);
    return tokens;
  }

  public async logoutAll(payload: TokenPayload) {
    await this.cacheManager.del(payload.accessTokenId);
    await this.tokenRepository.deleteAllByUserId(payload.sub);
  }

  public async logout(payload: TokenPayload) {
    await this.cacheManager.del(payload.accessTokenId);
    await this.tokenRepository.deleteOneByRefreshTokenId(payload.refreshTokenId);
  }
}
