import { IsEmail, IsString, MinLength } from 'class-validator';
import { parseISO } from 'date-fns';
import { makeAutoObservable } from 'mobx';
import { AbstractEntity } from 'types/AbstractEntity';
import { PermissionsEnum } from 'types/PermissionEnum';

export type UserId = string;

class User implements AbstractEntity {
  constructor(s?: any) {
    this.username = s?.username || '';
    this.email = s?.email || '';
    this.id = s?.id;
    this.name = s?.name;
    this.surname = s?.surname;
    this.lastSeenAt = s?.lastSeenAt ? parseISO(s.lastSeenAt) : null;
    this.group = s?.group;
    this.permissions = s?.permissions || [];
    this.createdAt = s?.createdAt ? parseISO(s.createdAt) : new Date();
    this.updatedAt = s?.updatedAt ? parseISO(s.updatedAt) : null;

    makeAutoObservable(this);
  }

  public createdAt: Date;

  public updatedAt: Date;

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

  public permissions: string[];

  get fullName(): string {
    return `${this.name} ${this.surname}`;
  }

  public isAllowed = (neededPermissions: PermissionsEnum[]): boolean => {
    for (const neededPermission of neededPermissions) {
      if (this.permissions.indexOf(neededPermission) >= 0) {
        return true;
      }
    }

    return false;
  };
}

export default User;
