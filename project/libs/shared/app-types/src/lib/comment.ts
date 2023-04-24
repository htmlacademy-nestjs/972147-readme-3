export abstract class Comment {
  public id!: string;

  public text!: string;

  public postId!: string;

  public createdAt!: Date;

  public updatedAt!: Date;

  public authorId!: string;
}
