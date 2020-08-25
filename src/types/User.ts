import { IsEmail, IsString, MinLength } from "class-validator";

export type UserId = number;

class User {
  constructor(s?: User) {
    this.username = s?.username || "";
    this.email = s?.email || "";
    this.id = s?.id;
    this.name = s?.name;
    this.surname = s?.surname;
  }

  public id: UserId;

  @IsString()
  @MinLength(2)
  public username: string;

  @IsString()
  @IsEmail()
  public email: string;

  public name: string;

  public surname: string;
}

export default User;
