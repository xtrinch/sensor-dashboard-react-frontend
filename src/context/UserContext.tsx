import { addToast } from 'context/ToastContext';
import { makeAutoObservable } from 'mobx';
import React, { createContext, useEffect, useMemo, useState } from 'react';
import UserService from 'services/UserService';
import { Toast } from 'types/Toast';
import User, { UserId } from 'types/User';

const UserContext = createContext<UserStore>(null);

class UserStore {
  public users: User[] = [];

  public usersLoaded: boolean = false;

  public totalItems: number = 0;

  public page: number = 1;

  public limit: number = 20;

  constructor() {
    makeAutoObservable(this);
  }

  public reload = async (params: { page: number } = { page: 1 }) => {
    this.page = params.page;
    const resp = await UserService.listUsers({ limit: this.limit, ...params });
    const userData = resp.items;

    this.totalItems = resp.meta?.totalItems;
    if (this.page === 1) {
      this.users = userData;
    } else {
      this.users.push(...userData);
    }
    this.usersLoaded = true;
  };

  public updateUser = async (id: UserId, user: Partial<User>): Promise<User> => {
    const s = await UserService.updateUser(id, user);

    const userIndex = this.users.findIndex((s) => s.id === id);
    this.users[userIndex] = s;

    addToast(new Toast({ message: 'Successfully updated the user', type: 'success' }));

    return s;
  };

  public deleteUser = async (id: UserId): Promise<boolean> => {
    await UserService.deleteUser(id);

    const idx = this.users.findIndex((s) => s.id === id);
    this.users.splice(idx, 1);

    addToast(new Toast({ message: 'Successfully deleted the user', type: 'success' }));

    return true;
  };
}

function UserContextProvider(props) {
  const userStore = useMemo(() => new UserStore(), []);

  return <UserContext.Provider value={userStore}>{props.children}</UserContext.Provider>;
}

export { UserContext, UserContextProvider };
