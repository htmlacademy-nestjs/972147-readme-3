import { PostRdo } from "./post.rdo";
import { Expose } from "class-transformer";

export class TextPostRdo extends PostRdo {
  @Expose()
  public name!: string;

  @Expose()
  public announceText!: string;

  @Expose()
  public mainText!: string;
}
