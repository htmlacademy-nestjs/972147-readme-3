import { Document } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export interface TokenModelInterface {
  userId: string;

  refreshTokenHash: string;

  expiresAt: Date;

  issuedAt: Date;
}

@Schema({
  collection: "tokens",
  timestamps: true
})
export class TokenModel extends Document implements TokenModelInterface {
  @Prop({ required: true })
  public userId!: string;

  @Prop({ required: true, unique: true })
  public refreshTokenHash!: string;

  @Prop({ required: true })
  public expiresAt!: Date;

  @Prop({ required: true })
  public issuedAt!: Date;
}

export const TokenSchema = SchemaFactory.createForClass(TokenModel);
