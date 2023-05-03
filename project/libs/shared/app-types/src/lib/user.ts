export abstract class User {
  public id!: string;
  public firstname!: string;
  public lastname!: string;
  public passwordHash!: string;
  public email!: string;
  public avatarFileId?: string;
  public registeredAt!: Date;
}
