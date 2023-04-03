import { Author } from "./author";

export abstract class Comment {
  public id: string;
  public text: string;
  public createdAt: Date;
  public author: Author;
}
