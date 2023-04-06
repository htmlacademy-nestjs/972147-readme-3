import { PostRdo } from "./post.rdo";
import { Expose } from "class-transformer";

export class ImagePostRdo extends PostRdo {
  @Expose()
  public imageUrl!: string;
}
