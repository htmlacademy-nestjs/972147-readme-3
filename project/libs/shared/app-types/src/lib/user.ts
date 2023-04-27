export abstract class User {
  public id!: string;
  public firstName!: string;
  public lastName!: string;
  public passwordHash!: string;
  public email!: string;
  public avatarFileId?: string;
  public registeredAt!: Date;
  public postsCount!: number;
  public subscribersCount!: number;
}
