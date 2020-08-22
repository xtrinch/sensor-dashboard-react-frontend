import { IsEmail, IsString, MinLength } from "class-validator";

export type UserId = number;

class User {
  constructor(s?: User) {
    this.username = s?.username || "";
    this.email = s?.email || "";
  }

  public id: UserId;

  @IsString()
  @MinLength(2)
  public username: string;

  @IsString()
  @IsEmail()
  public email: string;
}

export default User;
