export abstract class User {
  public id: string;
  public firstName: string;
  public lastName: string;
  public email: string;
  public avatar?: string;
  public registeredAt: Date;
  public postsCount: number;
  public subscribersCount: number;
}
