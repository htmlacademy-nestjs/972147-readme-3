import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TokenModel, TokenModelInterface } from './token.model';
import { Model } from 'mongoose';

@Injectable()
export class TokenRepository {
  constructor(@InjectModel(TokenModel.name) private readonly tokenModel: Model<TokenModel>) {}

  public async create(token: TokenModelInterface): Promise<TokenModelInterface> {
    const newToken = new this.tokenModel(token);
    return newToken.save();
  }

  public async findByRefreshTokenId(refreshTokenId: string): Promise<TokenModelInterface | null> {
    return this.tokenModel.findOne({ refreshTokenId }).exec();
  }

  public async findAllByUserId(userId: string): Promise<TokenModelInterface[]> {
    return this.tokenModel.find({ userId }).exec();
  }

  public async deleteAllByUserId(userId: string): Promise<void> {
    await this.tokenModel.deleteMany({ userId }).exec();
  }

  public async deleteOneByRefreshTokenId(refreshTokenId: string): Promise<void> {
    await this.tokenModel.deleteOne({ refreshTokenId }).exec();
  }
}
