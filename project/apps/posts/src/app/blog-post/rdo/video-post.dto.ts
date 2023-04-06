import { PostRdo } from "./post.rdo";
import { Expose } from "class-transformer";

export class VideoPostRdo extends PostRdo {
  @Expose()
  public name!: string;

  @Expose()
  public link!: string;
}
