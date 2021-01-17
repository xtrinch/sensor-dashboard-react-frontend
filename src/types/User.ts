import { IsEmail, IsString, MinLength } from "class-validator";
import { parseISO } from "date-fns";
import { AbstractEntity } from "types/AbstractEntity";

export type UserId = number;

class User extends AbstractEntity {
  constructor(s?: any) {
    super(s);

    this.username = s?.username || "";
    this.email = s?.email || "";
    this.id = s?.id;
    this.name = s?.name;
    this.surname = s?.surname;
    this.lastSeenAt = s?.lastSeenAt ? parseISO(s.lastSeenAt) : null;
    this.group = s?.group;
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

  public lastSeenAt: Date;

  public group: string;

  get fullName(): string {
    return `${this.name} ${this.surname}`;
  }
}

export default User;
